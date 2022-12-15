const express = require("express");
const router = express.Router();
const data = require("../data");
const profilesData = data.profile;
//const validationFunctions = data.validationFunctions

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
  .route("/profile")
  .get(async (req, res) => {
    try {
      // var finalresult = await profilesData.getAllProfiles();
      // console.log(finalresult);

      // res.json({
      //     msgg: "rajattttbhaiiii",
      //     finalresponse: finalresult,
      // });

      //res.send(allProfile);
      return res.render("profile", { title: "Event Rally" });
    } catch (e) {
      console.log(e);
      res.json({
        msg: "errrrrrrrrr",
        errrror: e,
      });
      //res.status(400).render('profile', { title: "Event Rally", error: e });
    }
  })
  .post(async (req, res) => {
  

    let profileData = req.body;
    let {
      userId,
      firstName,
      lastName,
      age,
      gender,
      profilePicture,
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
      //await validationFunctions.usernameValidator(username);
      //await validationFunctions.emailValidator(email);
      //await validationFunctions.ageValidator(age);
      //await validationFunctions.passwordValidator(password);

      let profileStatus = await profilesData.createProfile(
        userId,
        firstName,
        lastName,
        age,
        gender,
        profilePicture,
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
        console.log("Successfully Inserted");
        res.redirect("/profile");
      }
    } catch (e) {
      if (e.statusCode) {
        res
          .status(e.statusCode)
          .render("userRegister", {
            title: "Register",
            errors: true,
            error: e.error,
          });
      } else {
        res.status(500).json(e);
      }
    }
  });


router
.route("/details")
.get(async (req, res) => {
    
  try {
    // if (!req.session.login) {
    //   return res.render("userRegister", { title: "Register" });
    // }
    res.render("profileDetails", { title: "User Detail" });
  } catch (e) {
    console.log('here')
  }
});

module.exports = router;
