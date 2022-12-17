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
            return res.render("search",{title: "Search",result: final_data});
      }catch (e) {
            if (e.statusCode) {
              res.status(e.statusCode).render("error", {title: "Error", error404: true});
            } else {
              res.status(500).json("Internal Server Error");
            }
          }
    })


module.exports = router;