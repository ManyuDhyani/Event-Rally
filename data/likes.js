const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const events = mongoCollections.event;
let { ObjectId } = require('mongodb');
  
const createlike = async (eventId, userId, value) => {
    // Validation

    eventId = eventId.trim();
    userId = userId.trim();
    value = value.trim();

    // Current timestamp
    timestamp = new Date().toUTCString();
    
    let eventsCollection = await events();

    // Creating new like object
    let newLike = {
        user_id: userId,
        value: value,
        timestamp: timestamp
    }

    let event = await eventsCollection.findOne({_id: ObjectId(eventId)})
    if (!event) {
        throw {statusCode: 404, error:`No such event with id: ${eventId}`}
    }

    let insertLike = await eventsCollection.updateOne({_id:ObjectId(eventId)}, {$addToSet: {likes: newLike}});
    if (insertLike.modifiedCount === 0) {
        throw {statusCode: 500, error: "Internal Server Error: Unable to add the Like to the Event"};
    }

    let getUpdatedEvent = await eventsCollection.findOne({_id: ObjectId(eventId)});
    if(!getUpdatedEvent){
      throw {statusCode: 404, error: "Unable to get event after adding the Like"};
    }

    // Recalculate the likes and dislikes for the event and return.
    numberOfLikeObject = getUpdatedEvent.likes.length;
    let likeCount = 0, dislikesCount = 0;
    getUpdatedEvent.likes.forEach(likeObject => {
        if (likeObject.value === "like") {
            likeCount += 1;
        }
      });
    dislikesCount = numberOfLikeObject - likeCount;

    return {like: likeCount, dislike: dislikesCount};
};

module.exports = {
    createlike
};