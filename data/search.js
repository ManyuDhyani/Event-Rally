const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const event = mongoCollections.event;
const eventData = require('./events');
let { ObjectId } = require('mongodb');

const searchEventByTitle = async(word) => {
    const allEvents = await eventData.getAllEvent();
    let arr = [];
    let index = 0;
    for(let i = 0 ; i < allEvents.length ; i++){
        if(allEvents[i].title.toLowerCase().includes(word.toLowerCase())){
            arr[index] = allEvents[i];
            index = index + 1;
        }
    }

    for(let i = 0 ; i < arr.length; i++){
        arr[i]._id = arr[i]._id.toString();
    }
    return arr;
}

module.exports = {
    searchEventByTitle,
}