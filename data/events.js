const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const event = mongoCollections.event;

//function to create an event
const createEvent = async (userId,title,overview,content, category, thumbnail1,thumbnail2,thumbnail3,thumbnail4, tags, location, price) => {

    //call the validation function

    const eventCollections = await event();
    let newEvent = {
        userId:userId,
        title:title,
        overview:overview,
        content:content,
        category:category,
        thumbnail1:thumbnail1,
        thumbnail2:thumbnail2,
        thumbnail3:thumbnail3,
        thumbnail4:thumbnail4,
        tags:tags,
        location:location,
        price:price
    }

    //inserting newly created event object
    const insertInfo = await eventCollections.insertOne(newEvent);
    if(!insertInfo.acknowledge || !insertInfo.insertedId)
    {
        throw "Could not insert";
    }
};



//function to update an event
const updateEvent = async (userId,title,overview,content, category, thumbnail1,thumbnail2,thumbnail3,thumbnail4, tags, location, price) => {

    //validate everything here

    const eventCollections = await event();
    const beforeUpdate = await eventCollections.findOne({userId: userId});
    if(beforeUpdate === null)
    {
        throw 'could not find the event to be updated';
    }

    let updatedObj = {
        userId:userId,
        title:title,
        overview:overview,
        content:content,
        category:category,
        thumbnail1:thumbnail1,
        thumbnail2:thumbnail2,
        thumbnail3:thumbnail3,
        thumbnail4:thumbnail4,
        tags:tags,
        location:location,
        price:price
    }

    const updateInfo = await eventCollections.updateOne({userId: userId},{$set: updatedObj});
    if (updateInfo.modifiedCount === 0) {
        throw 'could not update event successfully';
    }

};
module.exports = {
    createEvent,
    updateEvent
};