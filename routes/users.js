const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const validationFunctions = data.validationFunctions

router
  .route('/')
  .get(async (req, res) => {
    // render landin page
    return res.render("index", {title: "Event Rally"});
  })

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    if (!req.session.login){
      return res.render("userRegister", {title: "Register"});
    }
    res.redirect("/profile")
  })
  .post(async (req, res) => {
    //code here for POST
    let registerData = req.body;
    let {username, email, password} = registerData;
    
    try {
      await validationFunctions.usernameValidator(username);
      await validationFunctions.emailValidator(email);
      await validationFunctions.passwordValidator(password);
      
      let registerationStatus = await usersData.createUser(username, email, password);
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
    res.redirect("/profile");
  })
  .post(async (req, res) => {
    //code here for POST
    let loginData = req.body;
    let {username, password} = loginData;
    try {
      await validationFunctions.usernameValidator(username);
      await validationFunctions.passwordValidator(password);
      let loginDetails = await usersData.checkUser(username, password)
      req.session.login = loginDetails;
      req.session.username = username;
      res.redirect("/profile");
    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).render("userLogin", {title: "Login", errors: true, error: e.error});
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  })

router
  .route('/profile')
  .get(async (req, res) => {
    //code here for GET
    res.render("profile", {title: "profile Page", username: req.session.username, timestamp: new Date().toUTCString()})
  })

router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.render("logout", {title: "Logged Out"});
  })


module.exports = router;