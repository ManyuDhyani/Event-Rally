const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const events = mongoCollections.event;
let { ObjectId } = require('mongodb');
  
const createlike = async (eventId, userId, value) => {
    // Validation

    await validationFunctions.idValidator(eventId);
    await validationFunctions.idValidator(userId);
    //await validationFunctions.valueValidator(value);
    

    eventId = eventId.trim();
    userId = userId.trim();
    value = value.trim();
   
    // Current timestamp
    timestamp = new Date();
    
    let eventsCollection = await events();

    // Creating new like object
    let newLike = {
        user_id: ObjectId(userId),
        value: value,
        timestamp: timestamp
    }

    //Check if event is present or not
    let event = await eventsCollection.findOne({_id: ObjectId(eventId)})
    if (!event) {
        throw {statusCode: 404, error:`No such event with id: ${eventId}`}
    }

    //Check if any like or a dislike is present for a given userId and eventID
    let val = await getLikesDislikesByUserId(userId,eventId);
    if(val==="none")
    {
        let insertLike = await eventsCollection.updateOne({_id:ObjectId(eventId)}, {$addToSet: {likes: newLike}});
        if (insertLike.modifiedCount === 0) {
            throw {statusCode: 500, error: "Internal Server Error: Unable to add the Like to the Event"};
        }
    }
    else if(val==="like")
    {   

        if(value==="like")
        {
            let removeLike = await removeLikesDislikes(userId,eventId);
        }
        else if(value==="dislike")
        {
            let update = await updateLikesDislikes(userId,eventId,value);
            return "dislikeoverlike";
        }
        else
        {
            throw {statusCode: 500, error: "Invalid value for like-dislike"};
        }
    }
    else if(val==="dislike")
    {
        if(value==="dislike")
        {
            let removeLike = await removeLikesDislikes(userId,eventId);
        }
        else if(value==="like")
        {
            let update = await updateLikesDislikes(userId,eventId,value);
            return "likeoverdislike";
        }
        else
        {
            throw {statusCode: 500, error: "Invalid value for like-dislike"};
        }
    }
};

const getLikesDislikes = async (eventId) => {
    // Validation
    await validationFunctions.idValidator(eventId);

    eventId = eventId.trim();
    let eventsCollection = await events();

    let eventData = await eventsCollection.findOne({_id: ObjectId(eventId)});
    if (!eventData) {
        throw {statusCode: 404, error: "This event doesn't exist"}
    }
    
    if (eventData.likes.length === 0){
        return {like: 0, dislike: 0};
    }

    // Calculate the likes and dislikes for the event and return.
    numberOfLikeObject = eventData.likes.length;
    let likeCount = 0, dislikesCount = 0;
    eventData.likes.forEach(likeObject => {
        if (likeObject.value === "like") {
            likeCount += 1;
        }
      });
    dislikesCount = numberOfLikeObject - likeCount;

    return {like: likeCount, dislike: dislikesCount};
};

const getLikesDislikesByUserId = async (userId,eventId) =>{
    await validationFunctions.idValidator(userId);
    await validationFunctions.idValidator(eventId);
    
    let eventsCollection = await events();
    
    let eventData = await eventsCollection.findOne({_id: ObjectId(eventId)});
    if (eventData==null) {
        throw {statusCode: 404, error: "This event doesn't exist"}
    }

    let likes_obj_arr = eventData.likes;
    let value;
    for(let i=0;i<likes_obj_arr.length;i++)
    {
        if(likes_obj_arr[i].user_id.toString()===userId)
        {
            value=likes_obj_arr[i].value;
            return value;
        }
    }
    return "none";
}

//removes whole like object from of the given userId for an eventId
const removeLikesDislikes = async (userId,eventId) =>{
    await validationFunctions.idValidator(userId);
    await validationFunctions.idValidator(eventId);
    let eventsCollection = await events();

    let eventData = await eventsCollection.findOne({_id: ObjectId(eventId)});
    if (eventData==null) {
        throw {statusCode: 404, error: "This event doesn't exist"}
    }

    let removeLikeDislike = await eventsCollection.updateOne({_id:ObjectId(eventId)},{$pull:{likes:{user_id:ObjectId(userId)}}});
    if (removeLikeDislike.modifiedCount === 0) {
        throw {statusCode: 500, error: "Internal Server Error: Unable to remove Like to the Event"};
    }
}

const updateLikesDislikes = async (userId,eventId,value) =>{

    let eventsCollection = await events();
    let uddatelike = await eventsCollection.update({_id:ObjectId(eventId)},{"$set":{"likes.$[elemX].value":value}},{"arrayFilters":[{"elemX.user_id":ObjectId(userId)}]});
    if(uddatelike.modifiedCount===0)
    {
        throw {statusCode: 500, error: "Internal Server Error: Unable to update Like to the Event"};
    }
}

module.exports = {
    createlike,
    getLikesDislikes,
    getLikesDislikesByUserId,
    removeLikesDislikes,
    updateLikesDislikes
};