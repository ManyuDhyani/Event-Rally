const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('../validation');
const followers = mongoCollections.followers;

const createFollowers = async (userId, followedUserId) => {
    // validation

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

module.exports = {
    createFollowers
};