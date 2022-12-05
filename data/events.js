const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const event = mongoCollections.event;

//function to create an event
const createEvent = async (userId,title,overview,content, category, thumbnail1,thumbnail2,thumbnail3,thumbnail4, tags, location, price) => {

};

//function to update an event
const updateEvent = async (userId,title,overview,content, category, thumbnail1,thumbnail2,thumbnail3,thumbnail4, tags, location, price) => {

};
module.exports = {
    createEvent,
    updateEvent
};