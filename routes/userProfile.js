const express = require("express");
const router = express.Router();
const data = require("../data");
const profilesData = data.profile;
//const upload= require('../data/upload')
const validationFunctions = data.validationFunctions
const multer = require('multer');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/profilePictures');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

let upload = multer({
    storage: storage,
}).single('profilePicture');



router
    .route("/account-settings")
    .get(async(req, res) => {
        try {} catch (e) {}
    })
    .post(async(req, res) => {
        try {} catch (e) {}
    });





router
    .route("/details")
    .get(async(req, res) => {

        try {
            res.render("profileDetails", { title: "User Detail" , is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin});
        } catch (e) {
            if (e.statusCode) {
                res.status(e.statusCode).render("error", {title: "Error", error404: true, is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin});
              } else {
                res.status(500).json("Internal Server Error");
              }
        }
    })
    .post(upload, async(req, res) => {
        let profileData = req.body;
        
        let {
            firstName,
            lastName,
            gender,
            websiteLink,
            youtubeLink,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
            pincode,
            bio,
        } = profileData;

        try {

            let profileStatus = await profilesData.createProfile(
                req.session.login.loggedUser._id,
                firstName,
                lastName,
                gender,
                req.file.filename,
                websiteLink,
                youtubeLink,
                addressLine1,
                addressLine2,
                city,
                state,
                country,
                pincode,
                bio
            );
            
            if (profileStatus.insertedProfile === true) {
                res.redirect(`/${req.session.login.loggedUser._id}`);
            }
        } catch (e) {
            if (e.statusCode) {
                res.status(e.statusCode).render("error", {
                    title: "error",
                    error403: true,
                    error: e.error,
                });
            } else {
                res.status(500).json(e);
            }
        }
    });

module.exports = router;