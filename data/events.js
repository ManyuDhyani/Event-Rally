const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const event = mongoCollections.event;
const { ObjectId } = require('mongodb');



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
        created:new Date().toUTCString()
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

    //Check if the exsisting obj and the new fileds to be updated does not have any change or not
    if(beforeUpdate.userId===userId || beforeUpdate.title===title || beforeUpdate.overview===overview || beforeUpdate.content===content || beforeUpdate.category===category || beforeUpdate.thumbnail_1===thumbnail_1 || beforeUpdate.thumbnail_2===thumbnail_2|| beforeUpdate.thumbnail_3===thumbnail_3|| beforeUpdate.thumbnail_4===thumbnail_4|| beforeUpdate.location===location|| beforeUpdate.price===price)
    {
        throw {statusCode: 404, error: "No different value to be updated"};
    }

    //Function to compare if 2 arrays are same or not
    const compareArrays = (a, b) =>{
        if(a.length === b.length && a.every((element, index) => element === b[index]))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    if(compareArrays(beforeUpdate.tags,tags_arr)===true)
    {
        throw {statusCode: 404, error: "No different value to be updated"};
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
        following:[],
        attending:[]
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

// Get all events published by the users
const getUsersEvents = async (userID) =>{
    validationFunctions.idValidator(userID);
    userID = userID.trim()

    const eventCollections = await event();
    const getEventInfo = await eventCollections.find({userId: ObjectId(userID)}, {projection: {title: 1, overview: 1, category: 1, thumbnail_1: 1, location: 1, price: 1}}).sort({created: -1}).toArray();
    return {eventCount: getEventInfo.length, events: getEventInfo};
};

// Get all events
const getAllEvent = async () =>{
    const eventCollections = await event();
    let allEventsList = await eventCollections.find({}).toArray();
    return allEventsList;
};


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
    checkEventFollower
};