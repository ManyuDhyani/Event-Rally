const express = require('express');
const router = express.Router();
const data = require('../data');
const eventData = data.events;
const likesData = data.likes;
const commentsData = data.comments
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
      return res.render("events/eventCreateForm", {title:"Create Event", is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin});
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

      await validationFunctions.eventObjValidator(0,null,req.session.login.loggedUser._id, req.body.title, req.body.overview, req.body.content, req.body.category, req.file.filename, req.body.thumbnail_2, req.body.thumbnail_3, req.body.thumbnail_4, req.body.tags, req.body.location, req.body.price);
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
});

router
  .route('/all')
  .get(async (req, res) => {
    // render landing page
    try {
      let eventList = await eventData.getAllEvent();
      if (req.session.login){
        return res.render("events/allEvents", {title: "Events", is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin, events:eventList});
      }
      return res.render("events/allEvents", {title: "Events", events:eventList});
    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).render("error", {title: "Error", error404: true, error: e.error});
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    try
      {
        //render the form for entering all the data for event creation
        let eventID = req.params.id;
        await validationFunctions.idValidator(eventID)
        let eventFetched = await eventData.getEventInfo(eventID);
        // Get likes Dislike Count
        let countLikesDislikes = await likesData.getLikesDislikes(eventID);
        // Fetch all parent comment data
        let getEventParentComments = await commentsData.getAllEventParentComments(eventID);
        // Fetch attending count and check if current user is attending the event
        let AttendingData = await eventData.getAttendees(eventID);
        // Fetch followers for the event and check if current user is following the event or not
        let followersData = await eventData.getEventFollowers(eventID);

        // Check user is attending or following or not only when user is logged in
        let loggedUserAttending = false, loggedUserfollowing = false;
        if (req.session.login){
          AttendingData.attendingList.forEach(attendingID => {
            if (req.session.login.loggedUser._id === attendingID){
              loggedUserAttending = true;
            }
          });

          followersData.followingList.forEach(followersID => {
            if (req.session.login.loggedUser._id === followersID){
              loggedUserfollowing = true;
            }
          });
          return res.render("events/event", {
            title: "Event Rally",
            event:eventFetched, 
            is_authenticated: req.session.login.authenticatedUser, 
            username: req.session.username, 
            user: req.session.login.loggedUser,
            is_admin: req.session.login.loggedUser.admin, 
            countlikesDislikes:countLikesDislikes, 
            parentComments: getEventParentComments,
            attending: AttendingData,
            isAttending: loggedUserAttending,
            followers: followersData,
            isFollowing: loggedUserfollowing
          });
        }
        return res.render("events/event", {
          title: "Event Rally",
          event:eventFetched, 
          is_authenticated: false, 
          countlikesDislikes:countLikesDislikes, 
          parentComments: getEventParentComments,
          attending: AttendingData,
          isAttending: loggedUserAttending,
          followers: followersData,
          isFollowing: loggedUserfollowing,
          is_admin: req.session.login.loggedUser.admin
        });
    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).render("error", {title: "Error", error404: true});
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  });

module.exports = router; 