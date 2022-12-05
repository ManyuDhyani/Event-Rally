const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const validationFunctions = data.validationFunctions

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    if (!req.session.login){
      return res.render("userLogin", {title: "Login"});
    }
    res.redirect("/protected");
  })

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    if (!req.session.login){
      return res.render("userRegister", {title: "Register"});
    }
    res.redirect("/protected")
  })
  .post(async (req, res) => {
    //code here for POST
    let registerData = req.body;
    let {usernameInput, passwordInput} = registerData;
    try {
      await validationFunc.createValidator(usernameInput, passwordInput);
      let registerationStatus = await usersData.createUser(usernameInput, passwordInput);
      if (registerationStatus.insertedUser === true) {
        res.redirect("/");
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
  .post(async (req, res) => {
    //code here for POST
    let loginData = req.body;
    let {usernameInput, passwordInput} = loginData;
    try {
      await validationFunc.createValidator(usernameInput, passwordInput);
      let loginDetails = await usersData.checkUser(usernameInput, passwordInput);
      req.session.login = loginDetails;
      req.session.username = usernameInput;
      res.redirect("/protected");
    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).render("userLogin", {title: "Login", errors: true, error: e.error});
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  })

router
  .route('/protected')
  .get(async (req, res) => {
    //code here for GET
    res.render("private", {title: "Protected Page", username: req.session.username, timestamp: new Date().toUTCString()})
  })

router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.render("logout", {title: "Logged Out"});
  })


module.exports = router;