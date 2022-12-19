const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const event = mongoCollections.event;
const { ObjectId } = require('mongodb');
const { events } = require('.');
const profileData = require('./profile');
const likesData = require('./likes');


//function to create an event
const createEvent = async (userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags, location, price) => {

    //call the validation function
    //here we pass a flag 0 as 1st argument and null as eventId (2nd argument) to the eventObjValidator so that it can skip checking for the eventId as in case of the updateEvent function
    const tags_arr = await validationFunctions.eventObjValidator(0,null,userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags, location, price);

    const eventCollections = await event();
    let newEvent = {
        userId: ObjectId(userId),
        title:title,
        overview:overview,
        content:content,
        category:category,
        thumbnail_1:thumbnail_1,
        thumbnail_2:thumbnail_2,
        thumbnail_3:thumbnail_3,
        thumbnail_4:thumbnail_4,
        tags:tags_arr,
        location:location,
        price:price,
        likes:[],
        following:[],
        attending:[],
        created:new Date()
    }

    //inserting newly created event object
    const insertInfo = await eventCollections.insertOne(newEvent);
    if(!insertInfo.acknowledged || !insertInfo.insertedId)
    {
        throw {statusCode: 404, error: "Could not insert the event"};
    }
   
    let eventFetchBack = await eventCollections.findOne({_id: insertInfo.insertedId});
    if(eventFetchBack===null)
    {
        throw {statusCode: 404, error: "Error in fetching back event after insertion"};
    }

    return eventFetchBack._id.toString();
};



//function to update an event
const updateEvent = async (eventId,userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags, location, price) => {

    //validate everything here
    //here we pass flag value '1' as the 1st argument so that it validates eventId as well
    const tags_arr = await validationFunctions.eventObjValidator(1,eventId,userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags, location, price);


    const eventCollections = await event();
    //First we search and get the event Obj to be updated..
    const beforeUpdate = await eventCollections.findOne({_id: ObjectId(eventId)});
    if(beforeUpdate === null)
    {
        throw {statusCode: 404, error: "Event to be updated does not exsist"};
    }

    //creating a new object with updated values
    let updatedObj = {
        userId: ObjectId(userId),
        title:title,
        overview:overview,
        content:content,
        category:category,
        thumbnail_1:thumbnail_1,
        thumbnail_2:thumbnail_2,
        thumbnail_3:thumbnail_3,
        thumbnail_4:thumbnail_4,
        tags:tags_arr,
        location:location,
        price:price,
        likes:beforeUpdate.likes,
        following:beforeUpdate.following,
        attending:beforeUpdate.attending
    }

    const updateInfo = await eventCollections.updateOne({_id: ObjectId(eventId)},{$set: updatedObj});
    if (updateInfo.modifiedCount === 0) {
        throw {statusCode: 404, error: "Could not update successfully"};
    }
};


const getEventInfo = async (eventId) =>{

//Handling eventId
 if(!eventId)
 {
    throw {statusCode: 404, error: "EventId not provided"};
 }
 if(!ObjectId.isValid(eventId))
 {
    throw {statusCode: 404, error: "ID provided is not a valid ID"};
 }

 const eventCollections = await event();
 const eventFetched = await eventCollections.findOne({_id: ObjectId(eventId)});
 if(eventFetched === null)
 {
    throw {statusCode: 404, error: "Event does not exsist"};
 }

 eventFetched.userId = eventFetched.userId.toString();
 return eventFetched;

};

// Func to get the attendee List from event collection
const getAttendees = async (eventId) =>{
    validationFunctions.idValidator(eventId);
    const eventCollections = await event();
    let attendingList = await eventCollections.findOne({_id: ObjectId(eventId)}, {attending: 1});
    return {attendeeCount: attendingList.attending.length, attendingList: attendingList.attending}
};

// Func to get the followers List from event collection
const getEventFollowers = async (eventId) =>{
    validationFunctions.idValidator(eventId);
    const eventCollections = await event();
    let followingList = await eventCollections.findOne({_id: ObjectId(eventId)}, {following: 1});
    return {followersCount: followingList.following.length, followingList: followingList.following}
};

//function to push followers for an event
const pushEventFollower = async (userId,eventId) =>{
    validationFunctions.idValidator(userId);
    validationFunctions.idValidator(eventId);
    const eventCollections = await event();
    let eventFetched = await eventCollections.findOne({_id: ObjectId(eventId)});
    if(eventFetched === null)
    {
        throw {statusCode: 404, error: "Event does not exsist"};
    }
    
    const addFollower = await eventCollections.updateOne({ _id: ObjectId(eventId) }, { $push: { following: ObjectId(userId)}});
    if (addFollower.modifiedCount === 0) {
        throw {statusCode: 404, error: "Error in adding follower"};
    }
};

//push attender function
const pushEventAttender = async (userId,eventId) =>{
    validationFunctions.idValidator(userId);
    validationFunctions.idValidator(eventId);
    const eventCollections = await event();
    let eventFetched = await eventCollections.findOne({_id: ObjectId(eventId)});
    if(eventFetched === null)
    {
        throw {statusCode: 404, error: "Event does not exsist"};
    }
    
    const addAttender = await eventCollections.updateOne({ _id: ObjectId(eventId) }, { $push: { attending: ObjectId(userId)}});
    if (addAttender.modifiedCount === 0) {
        throw {statusCode: 404, error: "Error in adding follower"};
    }
};

//function to remove a follower from an event
const removeEventFollower = async(user_id,eventId) =>{
    validationFunctions.idValidator(user_id);
    validationFunctions.idValidator(eventId);
    const eventCollections = await event();
    let eventFetched = await eventCollections.findOne({_id: ObjectId(eventId)});
    if(eventFetched === null)
    {
        throw {statusCode: 404, error: "Event does not exsist"};
    }
    const removeFollower = await eventCollections.updateOne({_id:ObjectId(eventId)},{$pull :{ following:ObjectId(user_id)}});
    if (removeFollower.modifiedCount === 0) {
        throw {statusCode: 404, error: "Error in adding follower"};
    }
}

//remove attender function
const removeEventAttender = async(user_id,eventId) =>{
    validationFunctions.idValidator(user_id);
    validationFunctions.idValidator(eventId);
    const eventCollections = await event();
    let eventFetched = await eventCollections.findOne({_id: ObjectId(eventId)});
    if(eventFetched === null)
    {
        throw {statusCode: 404, error: "Event does not exsist"};
    }
    const removeAttender = await eventCollections.updateOne({_id:ObjectId(eventId)},{$pull :{ attending:ObjectId(user_id)}});
    if (removeAttender.modifiedCount === 0) {
        throw {statusCode: 404, error: "Error in adding follower"};
    }
}

//check if the follower is present for the given event or not
const checkEventFollower = async(userId,eventId) =>{
    validationFunctions.idValidator(userId);
    validationFunctions.idValidator(eventId);
    const eventCollections = await event();
    let eventFetched = await eventCollections.findOne({_id: ObjectId(eventId)});
    if(eventFetched === null)
    {
        throw {statusCode: 404, error: "Event does not exsist"};
    }
    let following_arr = eventFetched.following;
    
    for(let i=0;i<following_arr.length;i++)
    {
        if(following_arr[i].toString()===userId)
        {
            return true;
        }
    }
    return false;
}

//gettotalfollowers for the given eventId
const getEventFollowersCounts = async (eventId) =>{
    await validationFunctions.idValidator(eventId);
    const eventCollections = await event();
    let eventFetched = await eventCollections.findOne({_id: ObjectId(eventId)});
    if(eventFetched === null)
    {
        throw {statusCode: 404, error: "Event does not exsist"};
    }
    let follow_arr = eventFetched.following;

    let male_followers = 0;
    let female_followers = 0;
    let trans_followers = 0;
    let nonbinary_followers = 0;
    let unknown_followers = 0;

    if(follow_arr.length===0)
    {
        return {male_followers:0,female_followers:0,trans_followers:0,nonbinary_followers:0,unknown_followers:0}
    }

    for(let i =0;i<follow_arr.length;i++)
    {
        let user = await profileData.getProfileById(follow_arr[i].toString());
        if (!user)
        {
            unknown_followers++;
        }
        else if(user.gender==="Male")
        {
            male_followers++;
        }
        else if(user.gender==="Female")
        {
            female_followers++;
        }
        else if(user.gender==="Transgender")
        {
            trans_followers++;
        }
        else if(user.gender==="Non Binary")
        {
            nonbinary_followers++;
        }
        else if(!user || !user.gender || user.gender==="Unknown" || user.gender===null)
        {
            unknown_followers++;
        }
    }

    return {male_followers:male_followers,female_followers:female_followers,trans_followers:trans_followers,nonbinary_followers:nonbinary_followers,unknown_followers:unknown_followers};
}

//gettotalattenders for the given eventId
const getEventAttendersCounts = async (eventId) =>{
    await validationFunctions.idValidator(eventId);
    const eventCollections = await event();
    let eventFetched = await eventCollections.findOne({_id: ObjectId(eventId)});
    if(eventFetched === null)
    {
        throw {statusCode: 404, error: "Event does not exsist"};
    }
    let attend_arr = eventFetched.attending;

    let male_attenders = 0;
    let female_attenders = 0;
    let trans_attenders = 0;
    let nonbinary_attenders = 0;
    let unknown_attenders = 0;

    if(attend_arr.length===0)
    {
        return {male_attenders:0,female_attenders:0,trans_attenders:0,nonbinary_attenders:0,unknown_attenders:0}
    }

    for(let i =0;i<attend_arr.length;i++)
    {
        let user = await profileData.getProfileById(attend_arr[i].toString());
        if (!user)
        {
            unknown_attenders++;
        }
        else if(user.gender==="Male")
        {
            male_attenders++;
        }
        else if(user.gender==="Female")
        {
            female_attenders++;
        }
        else if(user.gender==="Transgender")
        {
            trans_attenders++;
        }
        else if(user.gender==="Non Binary")
        {
            nonbinary_attenders++;
        }
        else if(user.gender==="Unknown")
        {
            unknown_attenders++;
        }
    }

    return {male_attenders:male_attenders,female_attenders:female_attenders,trans_attenders:trans_attenders,nonbinary_attenders:nonbinary_attenders,unknown_attenders:unknown_attenders};
}

// check attender is present function
const checkEventAttender = async(userId,eventId) =>{
    validationFunctions.idValidator(userId);
    validationFunctions.idValidator(eventId);
    const eventCollections = await event();
    let eventFetched = await eventCollections.findOne({_id: ObjectId(eventId)});
    if(eventFetched === null)
    {
        throw {statusCode: 404, error: "Event does not exsist"};
    }
    let attending_arr = eventFetched.attending;
    
    for(let i=0;i<attending_arr.length;i++)
    {
        if(attending_arr[i].toString()===userId)
        {
            return true;
        }
    }
    return false;
}

// Get all events published by the users
const getUsersEvents = async (userID) =>{
    validationFunctions.idValidator(userID);
    userID = userID.trim()

    const eventCollections = await event();
    const getEventInfo = await eventCollections.find({userId: ObjectId(userID)}, {projection: {title: 1, overview: 1, category: 1, thumbnail_1: 1, location: 1, price: 1, created: 1}}).sort({created: -1}).toArray();
    return {eventCount: getEventInfo.length, events: getEventInfo};
};

// Get all events
const getAllEvent = async () =>{
    const eventCollections = await event();
    let allEventsList = await eventCollections.find({}).toArray();
    return allEventsList;
};


// Delete a particular Event
const deleteEvent = async (eventId) => {
    // validation
    await validationFunctions.idValidator(eventId);

    eventId = eventId.trim();

    let eventCollections = await event();
    let eventData = await eventCollections.findOne({_id: ObjectId(eventId)})
    if (!eventData) {
        throw {statusCode: 500, error: "Internal Server Error: The Event was not found in the Database"};
    }

    let deletedEvent = await eventCollections.deleteOne({_id: ObjectId(eventId)});
    if (deletedEvent.deletedCount === 0) {
        throw {statusCode: 500, error: "Internal Server Error: The Event could not be deleted"};
    }

    return {isDeleted: true};
};


//function to get sorted events based on  maximum likes
const getEventwithMaxLikes = async () =>{
   let allEvents = await getAllEvent();
   let relative_likes = 0;
   let newObj = {};
   for(i=0;i<allEvents.length;i++)
   {
    let likes_dislikes = await likesData.getLikesDislikes(allEvents[i]._id.toString());
    relative_likes = (likes_dislikes.like - likes_dislikes.dislike);
    newObj[allEvents[i]._id.toString()] = relative_likes;
   }
 
   let sortable = [];
    for (var event in newObj) {
        sortable.push([event, newObj[event]]);
    }

    sortable.sort(function(a, b) {
    return a[1] - b[1];
    });

    //getting top 4 events from bottom of this array
    let trending =[];
    count=0;
    i=sortable.length-1;
    while(i>=0)
    {
        if(count==5)
        {
            break;
        }
        let eventId = sortable[i][0];
        let eventfetch = await getEventInfo(eventId);
        trending.push(eventfetch);
        i--;
        count++;
    }
    
   return trending;
}

const getEventsByTag = async (tag) => {
    tag = tag.trim();
    const eventCollections = await event();
    let allEventsList = await eventCollections.find({}).toArray();
    let neededEvents = [];
    let index = 0;
    
    for(let i = 0 ; i < allEventsList.length; i++){
        if(allEventsList[i].tags.includes(tag)){
            neededEvents[index] = allEventsList[i];
            index= index+1;
        }
    }
    return (neededEvents);
}

const getLatestEvent = async () => {
    const eventCollections = await event();
    let allLatestEventsList = await eventCollections.find({}).sort({created: -1}).toArray();
    if (allLatestEventsList.length === 0){
        return {noEvents: true}
    }
    return allLatestEventsList;

}

module.exports = {
    createEvent,
    updateEvent,
    getEventInfo,
    getAttendees,
    getEventFollowers,
    getUsersEvents,
    getAllEvent,
    pushEventFollower,
    removeEventFollower,
    checkEventFollower,
    pushEventAttender,
    removeEventAttender,
    checkEventAttender,
    deleteEvent,
    getEventsByTag,
    getEventFollowersCounts,
    getEventAttendersCounts,
    getEventwithMaxLikes,
    getLatestEvent
};