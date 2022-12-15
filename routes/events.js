const express = require('express');
const router = express.Router();
const data = require('../data');
const eventData = data.events;
const validationFunctions = data.validationFunctions


router
.route('/create')
.get(async(req,res)=>{
  try
  {
    res.render("events/eventCreateForm",{title:"Event Rally"});
  }
  catch(e)
  {
    res.render("events/eventCreateForm",{title:"Event Rally"},{error:e.error});
  }
})
.post(async(req, res) => {
  // validation for req.body all fileds here
  try
  { 
      console.log("here 1");
      //userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags, location, price
      const validate = await validationFunctions.eventObjValidator(0,null,req.session.login.loggedUser._id, req.body.title, req.body.overview, req.body.content, req.body.category, req.body.thumbnail_1, req.body.thumbnail_2, req.body.thumbnail_3, req.body.thumbnail_4, req.body.tags, req.body.location, req.body.price);

      const createEvent = await eventData.createEvent(req.session.login.loggedUser._id, req.body.title, req.body.overview, req.body.content, req.body.category, req.body.thumbnail_1, req.body.thumbnail_2, req.body.thumbnail_3, req.body.thumbnail_4, req.body.tags, req.body.location, req.body.price);
      
      res.redirect('/events/'+createEvent);
  }
  catch(e)
  {
      console.log(e);
      res.status(400).render('events/eventCreateForm',{title:"Event Rally",error:e.error});
  }
})

router
  .route('/:id')
  .get(async (req, res) => {
    try
    {
        //render the form for entering all the data for event creation
        const eventFetched = await eventData.getEventInfo(req.params.id);
        return res.render("events/event", {title: "Event Rally",event:eventFetched});
    }
    catch(e)
    {
        res.status(400).render('event',{title:"Event Rally",error:e.error});
    }
  })


module.exports = router; 