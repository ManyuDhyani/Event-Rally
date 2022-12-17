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
            res.render("profileDetails", { title: "User Detail" });
        } catch (e) {
            console.log("error profiledetails");
        }
    })
    .post(upload, async(req, res) => {
        let profileData = req.body;
        //console.log("Request Body", profileData);
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
            //console.log(req.file);
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