const e = require('express');
const express = require('express');
const router = express.Router();
const data = require('../data');
const reportsData = data.reports;
const validationFunctions = data.validationFunctions;
const xss = require('xss');

router
  .post('/user', async (req,res) => {
        try {
            if (req.session.login){
                let against = xss(req.body.against);
                let againstId = xss(req.body.againstId);
                let complaint = xss(req.body.complaint);
                
                await validationFunctions.againstValidator(against);
                await validationFunctions.idValidator(againstId);
                await validationFunctions.complaintValidator(complaint);

                await reportsData.createReport(req.session.login.loggedUser._id, against, againstId, complaint);
                return res.redirect(`/${againstId}`);
            } else {
                return res.redirect('/login');
            }
        } catch (e) {
            if (e.statusCode) {
              res.status(e.statusCode).render("error", {title: "Error", error404: true, is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin});
            } else {
              res.status(500).json("Internal Server Error");
            }
          }
    });

router
  .post('/event', async (req,res) => {
          try {
              if (req.session.login){
                  let against = xss(req.body.against);
                  let againstId = xss(req.body.againstId);
                  let complaint = xss(req.body.complaint);
                  
                  await validationFunctions.againstValidator(against);
                  await validationFunctions.idValidator(againstId);
                  await validationFunctions.complaintValidator(complaint);
  
                  await reportsData.createReport(req.session.login.loggedUser._id, against, againstId, complaint);
                  return res.redirect(`/events/${againstId}`);
              } else {
                  return res.redirect('/login');
              }
          } catch (e) {
              if (e.statusCode) {
                res.status(e.statusCode).render("error", {title: "Error", error404: true, is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin});
              } else {
                res.status(500).json("Internal Server Error");
              }
            }
      });

router
  .post('/comment', async (req,res) => {
      try {
          if (req.session.login){
              let against = xss(req.body.against);
              let againstId = xss(req.body.againstId);
              let complaint = xss(req.body.complaint);
                      
              await validationFunctions.againstValidator(against);
              await validationFunctions.idValidator(againstId);
              await validationFunctions.complaintValidator(complaint);
      
              await reportsData.createReport(req.session.login.loggedUser._id, against, againstId, complaint);
              return res.redirect(`/events/${againstId}`);
            } else {
                return res.redirect('/login');
            }
          } catch (e) {
              if (e.statusCode) {
                res.status(e.statusCode).render("error", {title: "Error", error404: true, is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin});
              } else {
                  res.status(500).json("Internal Server Error");
                }
              }
    });


module.exports = router; 