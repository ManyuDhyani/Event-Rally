const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const followers = mongoCollections.followers;
let { ObjectId } = require('mongodb');

const createFollowers = async (userId, followedUserId) => {
    // validation
    await validationFunctions.idValidator(userId);
    await validationFunctions.idValidator(followedUserId);

    userId = userId.trim();
    followedUserId = followedUserId.trim();

    // Current timestamp
    timestamp = new Date().toUTCString();
    
    let followersCollection = await followers();

    // Creating new followers object
    let newfollowers = {
        user_id: userId,
        followed_user_id: followedUserId,
        timestamp: timestamp
    }

    let insertfollowers = await followersCollection.insertOne(newfollowers);
    if (!insertfollowers.acknowledged || insertfollowers.insertedCount === 0) {
        throw {statusCode: 500, error: "Internal Server Error: The Follower object was not added to the Database"};
    }

    // Check follower added or not, and return the submission status.
    if (insertfollowers.acknowledged || insertfollowers.insertedCount === 1) {
            return {followerAdded: true};
    }

    return {followerAdded: false};
};


const getAllFollowers = async (userId) => {
    // validation
    await validationFunctions.idValidator(userId);

    userId = userId.trim();

    let followersCollection = await followers();

    // As the followers data is created when current logged in user, start following some other user.
    // So, to get the count of people following the current logged in user, 
    // we have to get the record of the people in whoes followed_user_id is equal to current user's id.
    let followersCount = await followersCollection.find({followed_user_id: ObjectId(userId)}).count();

    return followersCount;
};

module.exports = {
    createFollowers,
    getAllFollowers
};