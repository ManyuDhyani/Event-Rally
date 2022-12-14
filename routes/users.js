const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const profileData = data.profile;
const followersData = data.followers;
const eventsData = data.events;
const validationFunctions = data.validationFunctions
const xss = require('xss');

router
  .route('/')
  .get(async (req, res) => {
    // render landing page
    try {
      let latest = await eventsData.getLatestEvent();
      let trending = await eventsData.getEventwithMaxLikes();
      // We need latest 4 on landing page
      latest = latest.slice(0,4)
      if (req.session.login){
        return res.render("index", {title: "Event Rally", 
        is_authenticated: req.session.login.authenticatedUser, 
        username: req.session.username, 
        user: req.session.login.loggedUser, 
        is_admin: req.session.login.loggedUser.admin,
        latests: latest,
        trendings:trending
      });
      }
      return res.render("index", {title: "Event Rally", latests: latest, trendings:trending});

    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).render("error", {title: "error", error404: true, error: e.error});
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  })

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    if (!req.session.login){
      return res.render("userRegister", {title: "Register"});
    }
    res.redirect(`/${req.session.login.loggedUser._id}`)
  })
  .post(async (req, res) => {
    //code here for POST
    let username = xss(req.body.username);
    let email = xss(req.body.email);
    let age = xss(req.body.age);
    let password = xss(req.body.password);
    
    try {
      await validationFunctions.usernameValidator(username);
      await validationFunctions.emailValidator(email);
      await validationFunctions.ageValidator(age);
      await validationFunctions.passwordValidator(password);
      
      let registerationStatus = await usersData.createUser(username, email, age, password);
      if (registerationStatus.insertedUser === true) {
        res.redirect("/login");
      }
    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).render("userRegister", {title: "Register", errors: true, error: e.error});
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  })
 
router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
    if (!req.session.login){
      return res.render("userLogin", {title: "Login"});
    }
    res.redirect(`/${req.session.login.loggedUser._id}`);
  })
  .post(async (req, res) => {
    //code here for POST
    let username = xss(req.body.username);
    let password = xss(req.body.password);
    try {
      await validationFunctions.usernameValidator(username);
      await validationFunctions.passwordValidator(password);
      let loginDetails = await usersData.checkUser(username, password)
      req.session.login = loginDetails;
      req.session.username = username;
      userID = loginDetails.loggedUser._id.toString();
      res.redirect(`/${userID}`);
    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).render("userLogin", {title: "Login", errors: true, error: e.error});
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  });

router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.render("logout", {title: "Logged Out"});
  });

router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    try {
      if (req.session.login){
        userID = req.params.id
        await validationFunctions.idValidator(req.params.id)
        userID = userID.trim();
  
        // Get profile data of the user
        let profileDetails = await profileData.getProfileById(userID);
        // Get followers count of the user, like how many are following him
        let getUsersFollowers = await followersData.getAllFollowers(userID);
        // Get all the event published by the user
        let getUsersEvent = await eventsData.getUsersEvents(userID);
        // Get user data except password
        let userDetails = await usersData.getUsersData(userID);
        let {eventCount, events} = getUsersEvent;
        
        res.render("profile", {
            title: userDetails.username,
            openedProfileID: userID,
            is_authenticated: req.session.login.authenticatedUser, 
            username: req.session.username, 
            userSessionData: req.session.login.loggedUser,
            is_admin: req.session.login.loggedUser.admin,
            profile: profileDetails,
            followersCount: getUsersFollowers,
            eventCount: eventCount,
            events: events,
            user: userDetails
          });
      } else {
        return res.redirect('/login')
      }
    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).render("error", {title: "Error", error404: true});
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  });

module.exports = router;