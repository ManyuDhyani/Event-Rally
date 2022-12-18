const express = require('express');
const router = express.Router();
const data = require('../data');
const eventData = data.events;
const likesData = data.likes;
const commentsData = data.comments
const validationFunctions = data.validationFunctions
const xss = require('xss');
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

// let upload = multer({
//   storage: storage,
// }).single('thumbnail_1');

let upload = multer({storage:storage});
let uploadMultiple = upload.fields([{name:"thumbnail_1",maxCount:10},{name:"thumbnail_2",maxCount:10},{name:"thumbnail_3",maxCount:10},{name:"thumbnail_4",maxCount:10}]);


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
.post(uploadMultiple,async(req, res) => {
  // validation for req.body all fileds here
  try
  { 
    if (req.session.login){
      //console.log(req.body);
      await validationFunctions.eventObjValidator(0,null,req.session.login.loggedUser._id, req.body.title, req.body.overview, req.body.content, req.body.category, req.files.thumbnail_1[0].filename, req.files.thumbnail_2[0].filename, req.files.thumbnail_3[0].filename, req.files.thumbnail_4[0].filename, req.body.tags, req.body.location, req.body.price);
      const createEvent = await eventData.createEvent(req.session.login.loggedUser._id, req.body.title, req.body.overview, req.body.content, req.body.category, req.files.thumbnail_1[0].filename, req.files.thumbnail_2[0].filename,req.files.thumbnail_3[0].filename, req.files.thumbnail_4[0].filename, req.body.tags, req.body.location, req.body.price);
      
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
  .delete('/delete', async (req, res) => {
      try {
          if (req.session.login){
              const eventID = xss(req.body.eventID);
              
              let success = await eventData.deleteEvent(eventID);
              if (success.isDeleted){
                  return res.redirect(`/${req.session.login.loggedUser._id}`)
              } else {
                  return res.render("error", {title: "Error", error500: true})
              }
          }
      } catch(e) {
          if (e.statusCode) {
              res.status(e.statusCode).render("error", {title: "Error", error404: true});
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
            title: eventFetched.title,
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
            isFollowing: loggedUserfollowing,
          });
        }
        return res.render("events/event", {
          title: eventFetched.title,
          event:eventFetched, 
          is_authenticated: false, 
          countlikesDislikes:countLikesDislikes, 
          parentComments: getEventParentComments,
          attending: AttendingData,
          isAttending: loggedUserAttending,
          followers: followersData,
          isFollowing: loggedUserfollowing,
        });
    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).render("error", {title: "Error", error404: true});
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  }).post(async(req,res) =>{
    try{
      let userId = req.body.userId;
      let eventId = req.body.eventId;
      let removefollower = req.body.removefollower;
      let firstcall = req.body.firstcall;
      let removeattender = req.body.removeattender;
      let likes_dislikes = req.body.likes_dislikes;
      let interaction = req.body.interaction;

      await validationFunctions.idValidator(userId);
      await validationFunctions.idValidator(eventId);


      if(interaction === "following" ){
      if(firstcall===true)
      {
        let result = await eventData.checkEventFollower(userId,eventId);
        return res.send({response: result});
      }
      else
      {
        if(removefollower===true)
        {
          await eventData.removeEventFollower(userId,eventId);
        }
        else if(removefollower===false)
        {
          await eventData.pushEventFollower(userId,eventId);
        }
        else
        {
          throw {statusCode: 404, error: "Error in adding follower"};
        }
      }
    }
    else if(interaction === "attending"){
      if(firstcall===true)
      {
        let result = await eventData.checkEventAttender(userId,eventId);
        return res.send({response: result});
      }
      else
      {
        if(removeattender===true)
        {
          await eventData.removeEventAttender(userId,eventId);
        }
        else if(removeattender===false)
        {
          await eventData.pushEventAttender(userId,eventId);
        }
        else
        {
          throw {statusCode: 404, error: "Error in adding follower"};
        }
      }
    }
    else if(interaction === "like_dislike")
    {
      if(firstcall===true)
      {
        let val =await likesData.getLikesDislikesByUserId(userId,eventId);
        let countObj = await likesData.getLikesDislikes(eventId);
        console.log("here 1");
        await eventData.getEventwithMaxLikes();
        console.log("here 2");
        if (val ==="none")
        {
          return res.send({likestatus: 1,like_counts:countObj.like,dislike_counts:countObj.dislike});
        }
        else if(val ==="like")
        {
          return res.send({likestatus: 2,like_counts:countObj.like,dislike_counts:countObj.dislike});
        }
        else if(val ==="dislike")
        {
          return res.send({likestatus:3,like_counts:countObj.like,dislike_counts:countObj.dislike});
        }
        else
        {
          throw {statusCode: 404, error: "Error getting like dislike status of the event by the user"};
        }
      }
      else if(firstcall===false)
      {
        let value = req.body.value;
        const createlike = await likesData.createlike(eventId,userId,value);
        let countObj = await likesData.getLikesDislikes(eventId);
        if(createlike ==="dislikeoverlike")
        {
          return res.send({changebtn:0,like_counts:countObj.like,dislike_counts:countObj.dislike});
        }
        else if(createlike ==="likeoverdislike")
        {
          return res.send({changebtn:1,like_counts:countObj.like,dislike_counts:countObj.dislike});
        }
        res.send({like_counts:countObj.like,dislike_counts:countObj.dislike});
      }
    }
      
    }
    catch(e)
    {
      if (e.statusCode) {
        res.status(e.statusCode).render("error", {title: "Error", error404: true});
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  });

router
  .route('/update/:id')
  .get(async (req, res) => {
      await validationFunctions.idValidator(req.params._id);
      console.log("in update/id route");
  })

module.exports = router; 