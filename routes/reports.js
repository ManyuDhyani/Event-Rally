const express = require('express');
const router = express.Router();
const data = require('../data');
const reportsData = data.reports;
const validationFunctions = data.validationFunctions;

router
    // .route('/comments/:eventID')
    .route('/reports')
    .get(async (req,res) => {
        try {
            if(!req.session.login){
                return res.render("userLogin", {title: "Login"});
            }
            else{
                validationFunctions.idValidator(req.session.userId);
                return res.render("reportPage");
            }
        } catch (error) {
            throw {statusCode: 500, error: e};
        }
    })

    .post(async (req,res) => {
        try {
            validationFunctions.idValidator(req.session.userId);
            validationFunctions.againstValidator(req.params.against);
            validationFunctions.complaintValidator(req.params.complaint);

            const against = req.params.against.trim();
            const complaint = req.params.complaint.trim();

            reportsData.createReport(req.session.userId,against,complaint);
            
        } catch (error) {
            throw {statusCode: 500, error: e};
        }
    })