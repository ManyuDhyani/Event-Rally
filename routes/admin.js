const express = require('express');
const router = express.Router();
const data = require('../data');
const adminData = data.adminData;
const userData = data.users;
const reportData = data.reports;
const validationFunctions = data.validationFunctions;
const xss = require('xss');

router
    .route('/allusers')
        .get(async(req,res) => {
            try{
                if (req.session.login && req.session.login.loggedUser.admin){
                    let allusers = await adminData.allUsers();
                    return res.render("adminDashboardUsers", {
                        title: "Dashboard: All Users", 
                        result: allusers,
                        is_authenticated: req.session.login.authenticatedUser, 
                        username: req.session.username, 
                        user: req.session.login.loggedUser,
                        is_admin: req.session.login.loggedUser.admin,
                    });
                } else {
                    return res.redirect('/login')
                }
            } catch (e) {
                if (e.statusCode) {
                  res.status(e.statusCode).render("error", {title: "Error", error403: true, is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin});
                } else {
                  res.status(500).json("Internal Server Error");
                }
            }
        })
        .patch(async (req, res) => {
            let userID = xss(req.body.userID)
            try{
                if (req.session.login && req.session.login.loggedUser.admin){
                    let verfiedDataUpdated = await userData.updateVerifiedFieldData(userID);

                    // To activate certain message: error or success updatedAction and updatedActionFailed is used
                    let updatedAction = false, updatedActionFailed = false;
                    if (verfiedDataUpdated === true) {
                        updatedAction = true;
                    } else {
                        updatedActionFailed = true;
                    }
                    let allusers = await adminData.allUsers();
                    return res.render("adminDashboardUsers", {
                        title: "Dashboard: All Users", 
                        result: allusers,
                        is_authenticated: req.session.login.authenticatedUser, 
                        username: req.session.username, 
                        user: req.session.login.loggedUser,
                        is_admin: req.session.login.loggedUser.admin,
                        actionCompletedTrue: updatedAction,
                        actionCompletedFalse: updatedActionFailed
                    });
                }
            } catch (e) {
                if (e.statusCode) {
                  res.status(e.statusCode).render("error", {title: "Error", error403: true, is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin});
                } else {
                  res.status(500).json("Internal Server Error");
                }
            }
          });

router
    .route('/allreports')
    .get(async(req,res) => {
        try{
            if (req.session.login && req.session.login.loggedUser.admin){
                let allreports = await reportData.getAllReports(req.session.login.loggedUser._id);
                let empty = false;
                if (allreports.noReports){
                    empty = true
                }
                return res.render("adminDashboardReports", {
                    title: "Dashboard: All Reports", 
                    reports: allreports,
                    is_authenticated: req.session.login.authenticatedUser, 
                    username: req.session.username, 
                    user: req.session.login.loggedUser,
                    is_admin: req.session.login.loggedUser.admin,
                    noReportsData: empty
                });
            } else {
                return res.redirect('/login')
            }
        } catch (e) {
            if (e.statusCode) {
                res.status(e.statusCode).render("error", {title: "Error", error403: true, description: e.error, is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin});
            } else {
                res.status(500).json("Internal Server Error");
                }
            }
    })
    .delete(async (req, res) => {
                  let reportID = xss(req.body.userID)
                  try{
                      if (req.session.login && req.session.login.loggedUser.admin){
                        
                        await validationFunctions.idValidator(reportID);
                        let isDeleted = await reportData.deleteReportWithReportedItem(reportID);
                        if (isDeleted.noReports){
                            return res.redirect('/admin/allreports')
                        }

                        let updatedAction = false, updatedActionFailed = false;
                        if (isDeleted.success === true) {
                            updatedAction = true;
                        } else {
                            updatedActionFailed = true;
                        }
                        let empty = false;
                        let allreports = await reportData.getAllReports(req.session.login.loggedUser._id);
                        if (allreports.noReports){
                            empty = true
                        }
                        return res.render("adminDashboardReports", {
                            title: "Dashboard: All Reports", 
                            reports: allreports,
                            is_authenticated: req.session.login.authenticatedUser, 
                            username: req.session.username, 
                            user: req.session.login.loggedUser,
                            is_admin: req.session.login.loggedUser.admin,
                            actionCompletedTrue: updatedAction,
                            actionCompletedFalse: updatedActionFailed,
                            noReportsData: empty
                        });
                      }
                  } catch (e) {
                      if (e.statusCode) {
                        res.status(e.statusCode).render("error", {title: "Error", error403: true, is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin});
                      } else {
                        res.status(500).json("Internal Server Error");
                      }
                  }
                });

module.exports = router;