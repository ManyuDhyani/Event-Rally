const e = require('express');
const express = require('express');
const router = express.Router();
const data = require('../data');
const reportsData = data.reports;
const validationFunctions = data.validationFunctions;

router
    .route('/report')
    .get(async (req,res) => {
        try{
            if (req.session.login){
                return res.render("./partials/reportUser",{title: "Report"});
            }
            return res.redirect('/login');
        } catch (e) {
            if (e.statusCode) {
              res.status(e.statusCode).render("error", {title: "Error", error404: true});
            } else {
              res.status(500).json("Internal Server Error");
            }
          }
    })

    .post(async (req,res) => {
        try {
            if (req.session.login){
                let reportData = req.body
                let {against, againstId, complaint} = reportData;
                await validationFunctions.idValidator(req.session.login.loggedUser._id);
                await validationFunctions.againstValidator(against);
                await validationFunctions.idValidator(againstId);
                await validationFunctions.complaintValidator(complaint);

                reportsData.createReport(req.session.login.loggedUser._id, against, againstId, complaint);
            } else {
                return res.redirect('/login');
            }
        } catch (e) {
            if (e.statusCode) {
              res.status(e.statusCode).render("error", {title: "Error", error404: true});
            } else {
              res.status(500).json("Internal Server Error");
            }
          }
    })

module.exports = router; 