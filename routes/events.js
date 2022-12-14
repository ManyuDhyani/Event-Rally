const express = require('express');
const router = express.Router();
const data = require('../data');
const eventData = data.events;
const likesData = data.likes;
const commentsData = data.comments;
const searchData = data.search;
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
      await validationFunctions.eventObjValidator(0,null,req.session.login.loggedUser._id, xss(req.body.title), xss(req.body.overview), xss(req.body.content), xss(req.body.category), req.files.thumbnail_1[0].filename, req.files.thumbnail_2[0].filename, req.files.thumbnail_3[0].filename, req.files.thumbnail_4[0].filename, xss(req.body.tags), xss(req.body.location), xss(req.body.price));
      const createEvent = await eventData.createEvent(req.session.login.loggedUser._id, xss(req.body.title), xss(req.body.overview), xss(req.body.content), xss(req.body.category), req.files.thumbnail_1[0].filename, req.files.thumbnail_2[0].filename,req.files.thumbnail_3[0].filename, req.files.thumbnail_4[0].filename, xss(req.body.tags), xss(req.body.location), xss(req.body.price));
      
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
  .route('/latest')
  .get(async (req, res) => {
    // render landing page
    try {
      let eventList = await eventData.getLatestEvent();
      if (req.session.login){
        return res.render("partials/latest", {title: "Latest Events", is_authenticated: req.session.login.authenticatedUser, username: req.session.username, user: req.session.login.loggedUser, is_admin: req.session.login.loggedUser.admin, events: eventList});
      }
      return res.render("partials/latest", {title: "Latest Events", events: eventList});
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
        // Fetch the event Attendees Gender Distribution
        let AttendingGenders = await eventData.getEventAttendersCounts(eventID);
        // Fetch followers for the event and check if current user is following the event or not
        let followersData = await eventData.getEventFollowers(eventID);
        // Fetch the event followers Gender Distribution
        let FollowersGenders = await eventData.getEventFollowersCounts(eventID);
        // Check user is attending or following or not only when user is logged in
        let loggedUserAttending = false, loggedUserfollowing = false;
        // Get other events data of the similar data
        let same_category_events = await searchData.searchEventByCategory(eventFetched.category);
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
            attendingGender: AttendingGenders,
            followers: followersData,
            followersGender: FollowersGenders,
            isFollowing: loggedUserfollowing,
            tags: eventFetched.tags,
            category_events:same_category_events
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
          attendingGender: AttendingGenders,
          followers: followersData,
          followersGender: FollowersGenders,
          isFollowing: loggedUserfollowing,
          category_events:same_category_events
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
      await validationFunctions.idValidator(req.params.id);
      let event_id = req.params.id;
      let eventInfo = await eventData.getEventInfo(event_id);
      const arr = eventInfo.tags;
        for(let i = 0 ; i < arr.length ; i++){
          arr[i] = "#"+arr[i];
        }
        eventInfo.tags = arr;
      return res.render("events/updateEvent",eventInfo);
  })
  .post(uploadMultiple, async (req,res) => {
    try{
      let event_id = req.params.id;
      let userId = req.session.login.loggedUser._id;
      let title = xss(req.body.title);
      let overview = xss(req.body.overview);
      let content = xss(req.body.content);
      let category = xss(req.body.category);
      let thumbnail_1 = req.files.thumbnail_1[0].filename;
      let thumbnail_2 = req.files.thumbnail_2[0].filename;
      let thumbnail_3 = req.files.thumbnail_3[0].filename;
      let thumbnail_4 = req.files.thumbnail_4[0].filename;
      let tags = xss(req.body.tags);
      let location = xss(req.body.location);
      let price = xss(req.body.price);


      await eventData.updateEvent(event_id,userId,title,overview,content,category,thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4,tags,location,price);
      res.redirect('/events/'+event_id);
      }catch(e)
      {
        if (e.statusCode) {
          res.status(e.statusCode).render("error", {title: "Error", error404: true});
        } else {
          res.status(500).json("Internal Server Error");
        }
      }

  })

router
  .route('/tags/:tag')
  .get(async(req,res) => {
    const tag = req.params.tag;
    let eventByTag = await eventData.getEventsByTag(tag);
    return res.render("events/eventsByTag", {title: "Events", events:eventByTag});
  })

module.exports = router; 