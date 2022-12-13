const express = require('express');
const router = express.Router();
const data = require('../data');
const eventData = data.events;
const validationFunctions = data.validationFunctions

router
  .route('/events')
  .get(async (req, res) => {
    try
    {
        //render the form for entering all the data for event creation
        return res.render("eventCreation", {title: "Event Rally"});
    }
    catch(e)
    {
        res.status(400).render('eventCreation',{title:"Event Rally",error:e});
    }
  })
  .post(async(req, res) => {
    // validation for req.body all fileds here
    try
    {
        //userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags, location, price
        validationFunctions.eventObjValidator(0,null,req.body.userId, req.body.title, req.body.overview, req.body.content, req.body.category, req.body.thumbnail_1, req.body.thumbnail_2, req.body.thumbnail_3, req.body.thumbnail_4, req.body.tags, req.body.location, req.body.price);

        const createEvent = await eventData.createEvent(req.body.userId, req.body.title, req.body.overview, req.body.content, req.body.category, req.body.thumbnail_1, req.body.thumbnail_2, req.body.thumbnail_3, req.body.thumbnail_4, req.body.tags, req.body.location, req.body.price);
        if(createEvent.inserted===true)
        {
            res.redirect('/events');
        }
        else
        {
            res.status(500).render('eventCreation',{title:"Event Rally",error:"Internal Server Error"});
        }
    }
    catch(e)
    {
        res.status(400).render('eventCreation',{title:"Event Rally",error:e});
    }
  })

  router
  .route('/update')
  .get(async(req,res) => {

  })
  .post(async(req,res) => {

  })


module.exports = router; 