const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const comments = mongoCollections.comments;
let { ObjectId } = require('mongodb');

const createComment = async (userId, eventId, username, parentCommentId, content) => {
    // validation
    // NOT NULL,string, lenght not zero AFTERN TRIM, 200 WORDS 
    await validationFunctions.idValidator(userId);
    await validationFunctions.idValidator(eventId);
    await validationFunctions.usernameValidator(username);
    
    if (parentCommentId != null) {
        await validationFunctions.idValidator(parentCommentId);
        parentCommentId = parentCommentId.trim();
    }
    await validationFunctions.contentValidator(content);

    // Cleaning: Triming data before saving
    userId = userId.trim();
    eventId = eventId.trim();
    content = content.trim();

    // Current timestamp
    timestamp = new Date().toUTCString();

    // If parentComment comes in empty, means this comment is a parent comment itself. So this comment's parent_comment_id will be null.
    if (parentCommentId == null) {
        parentCommentId = null;
    }

    const commentsCollection = await comments();

    // Creating new comment object
    let newComment = {
        user_id: ObjectId(userId),
        event_id: ObjectId(eventId),
        user_name: username,
        parent_comment_id: parentCommentId,
        content: content,
        timestamp: timestamp
    };

    let insertComment = await commentsCollection.insertOne(newComment);

    if (!insertComment.acknowledged) {
        throw {statusCode: 500, error: "Internal Server Error: The Comment was not added to the Database"};
    }
    
    // Now fetch the newly inserted comment and return it to be rendered on page.
    let newCommentID = insertComment.insertedId;
    
    let getNewComment = await commentsCollection.findOne({_id: ObjectId(newCommentID)});
    if (!getNewComment){
        throw {statusCode: 404, error: "Not able to fetch New comment"}
    }

    getNewComment._id = getNewComment._id.toString();
    getNewComment.user_id = getNewComment.user_id.toString();
    return getNewComment;
};


// This function get all comments for the particular event.
const getAllEventParentComments = async (eventId) => {
    // validation
    await validationFunctions.idValidator(eventId);

    eventId = eventId.trim();

    let commentsCollection = await comments();
    let commentsList = await commentsCollection.find({$and: [{event_id: ObjectId(eventId)}, {parent_comment_id: null}]}).toArray();
    
    commentsList.forEach(parentCommentObj => {
        parentCommentObj._id = parentCommentObj._id.toString();
        parentCommentObj.user_id = parentCommentObj.user_id.toString();
        parentCommentObj.event_id = parentCommentObj.event_id.toString();
    });
    
    return commentsList;
};

const getAllChildCommentsThread = async (parentCommentId) => {
    // validation
    await validationFunctions.idValidator(parentCommentId);

    parentCommentId = parentCommentId.trim();

    let commentsCollection = await comments();
    let commentsList = await commentsCollection.find({parent_comment_id: ObjectId(parentCommentId)}).sort({"timestamp": -1}).toArray();

    return commentsList;
};


const deleteComment = async (commentId) => {
    // validation
    await validationFunctions.idValidator(commentId);

    commentId = commentId.trim();

    let commentsCollection = await comments();
    let commentData = await commentsCollection.findOne({_id: ObjectId(commentId)})
    if (!commentData) {
        throw {statusCode: 500, error: "Internal Server Error: The Comment was not found in the Database"};
    }

    let deletedComment = await commentsCollection.deleteOne({_id: ObjectId(commentId)});
    if (deletedComment.deletedCount === 0) {
        throw {statusCode: 500, error: "Internal Server Error: The Comment could not be deleted"};
    }

    return {isDeleted: true};
};

module.exports = {
    createComment,
    getAllEventParentComments,
    getAllChildCommentsThread,
    deleteComment
}; 