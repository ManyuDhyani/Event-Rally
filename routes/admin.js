const express = require('express');
const router = express.Router();
const data = require('../data');
const adminData = data.adminData;
const validationFunctions = data.validationFunctions;

router
    // .route('/admin/allreports')
    //     .get(async(req,res) => {
    //         if (req.session.login && req.session.login.loggedUser.admin){
    //             let allreports = await adminData.allReports();
    //             return res.render("adminDashboardReports", {title: "All Reports",result:allreports});
    //           }
    //     })

    .route('/allusers')
        .get(async(req,res) => {
            if (req.session.login && req.session.login.loggedUser.admin){
                let allusers = await adminData.allUsers();
                // console.log(allusers);
                return res.render("adminDashboardUsers", {title: "All Users",result:allusers});
              }
        });



module.exports = router;