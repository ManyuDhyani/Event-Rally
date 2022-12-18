const express = require('express');
const router = express.Router();
const data = require('../data');
const eventData = data.events;
const searchData = data.search;
const validationFunctions = data.validationFunctions;

router
    .route('/events')
    .post(async (req,res) => {
        try{
            const searchEventByTitle = req.body.searchTitle;
            const final_data = await searchData.searchEventByTitle(searchEventByTitle);

            if(req.session.login){
              return res.render("search",{
                title: "Search",
                result: final_data,
                is_authenticated: req.session.login.authenticatedUser, 
                username: req.session.username, 
                user: req.session.login.loggedUser, 
                is_admin: req.session.login.loggedUser.admin
              });
            }

            return res.render("search",{title: "Search",result: final_data});

        } catch (e) {
            if (e.statusCode) {
              res.status(e.statusCode).render("error", {title: "Error", error404: true});
            } else {
              res.status(500).json("Internal Server Error");
            }
          }
    })

router
    .route('/category')
    .post(async (req,res) => {
      try{
          const searchEventByCategory = req.body.category;
          const final_data = await searchData.searchEventByCategory(searchEventByCategory);

          if(req.session.login){
            return res.render("search",{
              title: req.body.category,
              result: final_data,
              is_authenticated: req.session.login.authenticatedUser, 
              username: req.session.username, 
              user: req.session.login.loggedUser, 
              is_admin: req.session.login.loggedUser.admin
            });
          }
          
          return res.render("search",{title: req.body.category, result: final_data});
      }catch (e) {
            if (e.statusCode) {
              res.status(e.statusCode).render("error", {title: "Error", error404: true});
            } else {
              res.status(500).json("Internal Server Error");
            }
          }
    })


module.exports = router;