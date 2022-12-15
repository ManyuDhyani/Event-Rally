const express = require('express');
const router = express.Router();
const data = require('../data');
const reportsData = data.reports;
const validationFunctions = data.validationFunctions;

router
    .route('/report')
    .get(async (req,res) => {
        // code here for GET
        // if (!req.session.login){
        //     return res.render("userLogin", {title: "Login"});
        // }
        // else{
        //     validationFunctions.idValidator(req.session.userId);
            return res.render("./reports/reportPage",{title: "Report"});
        // }
    })

    .post(async (req,res) => {
        try {
            let reportData = req.body
            let {against, againstId, complaint} = reportData;
            await validationFunctions.idValidator(req.session.userId);
            await validationFunctions.againstValidator(against);
            await validationFunctions.idValidator(againstId);
            await validationFunctions.complaintValidator(complaint);

            reportsData.createReport(req.session.userId, against, againstId, complaint);

        } catch (error) {
            throw {statusCode: 500, error: e};
        }
    })

module.exports = router; 