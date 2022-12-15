const express = require('express');
const router = express.Router();
const data = require('../data');
const eventData = data.events;
const validationFunctions = data.validationFunctions
const multer = require('multer');

//image upload
let storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,'./public/uploads/events');
  },
  filename:function(req,file,cb){
    cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single('thumbnail_1');


router
.route('/create')
.get(async(req,res)=>{
  try
  {
    if (req.session.login){
      res.render("events/eventCreateForm", {title:"Create Event", is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser});
    }
    else
    {
      return res.render("userLogin", {title: "Login"});
    }
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).render("error", {title: "Error", error404: true});
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
})
.post(upload,async(req, res) => {
  // validation for req.body all fileds here
  try
  { 
    if (req.session.login){

      const validate = await validationFunctions.eventObjValidator(0,null,req.session.login.loggedUser._id, req.body.title, req.body.overview, req.body.content, req.body.category, req.file.filename, req.body.thumbnail_2, req.body.thumbnail_3, req.body.thumbnail_4, req.body.tags, req.body.location, req.body.price);
      const createEvent = await eventData.createEvent(req.session.login.loggedUser._id, req.body.title, req.body.overview, req.body.content, req.body.category, req.file.filename, req.body.thumbnail_2, req.body.thumbnail_3, req.body.thumbnail_4, req.body.tags, req.body.location, req.body.price);
      
      res.redirect('/events/'+createEvent);
    }
    else
    {
      return res.render("userLogin", {title: "Login"});
    }
  }catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).render("error", {title: "Error", error500: true});
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
})

router
  .route('/:id')
  .get(async (req, res) => {
    try
    {
        //render the form for entering all the data for event creation
        await validationFunctions.idValidator(req.params.id)
        const eventFetched = await eventData.getEventInfo(req.params.id);
        return res.render("events/event", {title: "Event Rally",event:eventFetched, is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser});
    }catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).render("error", {title: "Error", error404: true});
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  })


module.exports = router; 