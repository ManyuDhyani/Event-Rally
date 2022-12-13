const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const event = mongoCollections.event;
const { ObjectId } = require('mongodb');



//function to create an event
const createEvent = async (userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags, location, price) => {

    //call the validation function
    //here we pass a flag 0 as 1st argument and null as eventId (2nd argument) to the eventObjValidator so that it can skip checking for the eventId as in case of the updateEvent function
    validationFunctions.eventObjValidator(0,null,userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags, location, price);

    const eventCollections = await event();
    let newEvent = {
        userId:userId,
        title:title,
        overview:overview,
        content:content,
        category:category,
        thumbnail_1:thumbnail_1,
        thumbnail_2:thumbnail_2,
        thumbnail_3:thumbnail_3,
        thumbnail_4:thumbnail_4,
        tags:tags,
        location:location,
        price:price,
        likes:[],
        following:[],
        attending:[],
        created:new Date().toUTCString()
    }

    //inserting newly created event object
    const insertInfo = await eventCollections.insertOne(newEvent);
    if(!insertInfo.acknowledge || !insertInfo.insertedId)
    {
        throw {statusCode: 404, error: "Could not insert the event"};
    }
};



//function to update an event
const updateEvent = async (eventId,userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags, location, price) => {

    //validate everything here
    //here we pass flag value '1' as the 1st argument so that it validates eventId as well
    validationFunctions.eventObjValidator(1,eventId,userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags, location, price);


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

    if(compareArrays(beforeUpdate.tags,tags)===true)
    {
        throw {statusCode: 404, error: "No different value to be updated"};
    }
  
    //creating a new object with updated values
    let updatedObj = {
        userId:userId,
        title:title,
        overview:overview,
        content:content,
        category:category,
        thumbnail_1:thumbnail_1,
        thumbnail_2:thumbnail_2,
        thumbnail_3:thumbnail_3,
        thumbnail_4:thumbnail_4,
        tags:tags,
        location:location,
        price:price
    }

    const updateInfo = await eventCollections.updateOne({_id: ObjectId(eventId)},{$set: updatedObj});
    if (updateInfo.modifiedCount === 0) {
        throw {statusCode: 404, error: "Could not update successfully"};
    }
};

module.exports = {
    createEvent,
    updateEvent
};