const express = require('express');
const router = express.Router();
const data = require('../data');
const adminData = data.adminData;
const userData = data.users;
const validationFunctions = data.validationFunctions;
const xss = require('xss');




    // .route('/admin/allreports')
    //     .get(async(req,res) => {
    //         if (req.session.login && req.session.login.loggedUser.admin){
    //             let allreports = await adminData.allReports();
    //             return res.render("adminDashboardReports", {title: "All Reports",result:allreports});
    //           }
    //     })
router
    .route('/allusers')
        .get(async(req,res) => {
            try{
                if (req.session.login && req.session.login.loggedUser.admin){
                    let allusers = await adminData.allUsers();
                    return res.render("adminDashboardUsers", {
                        title: "All Users", 
                        result: allusers,
                        is_authenticated: req.session.login.authenticatedUser, 
                        username: req.session.username, 
                        user: req.session.login.loggedUser,
                    });
                }
            } catch (e) {
                if (e.statusCode) {
                  res.status(e.statusCode).render("error", {title: "Error", error403: true});
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
                        title: "All Users", 
                        result: allusers,
                        is_authenticated: req.session.login.authenticatedUser, 
                        username: req.session.username, 
                        user: req.session.login.loggedUser,
                        actionCompletedTrue: updatedAction,
                        actionCompletedFalse: updatedActionFailed
                    });
                }
            } catch (e) {
                if (e.statusCode) {
                  res.status(e.statusCode).render("error", {title: "Error", error403: true});
                } else {
                  res.status(500).json("Internal Server Error");
                }
            }
          });



module.exports = router;