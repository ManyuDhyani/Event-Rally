const express = require("express");
const router = express.Router();
const data = require("../data");
const profilesData = data.profile;
const upload= require('../data/upload')
const validationFunctions = data.validationFunctions





router
  .route("/account-settings")
  .get(async (req, res) => {
    try {
    } catch (e) {}
  })
  .post(async (req, res) => {
    try {
    } catch (e) {}
  });


  


router
  .route("/details")
  .get(async (req, res) => {
    
    try {
      res.render("profileDetails", { title: "User Detail" });
    } catch (e) {
      console.log("error profiledetails");
    }
  })
  .post(upload.single('avatar'), async (req, res) => {
    let profileData = req.body;
    
    let {
      firstName,
      lastName,
      age,
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
        age,
        gender,
        req.file,
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
        res.redirect("/profile/profile-home");
      }
    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).render("userRegister", {
          title: "Register",
          errors: true,
          error: e.error,
        });
      } else {
        res.status(500).json(e);
      }
    }
  });

module.exports = router;