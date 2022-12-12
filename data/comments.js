const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const comments = mongoCollections.comment;
let { ObjectId } = require('mongodb');

const createComment = async (userId, eventId, parentCommentId, content) => {
    // validation
    // NOT NULL,string, lenght not zero AFTERN TRIM, 200 WORDS 
    validationFunctions.idValidator(userId);
    validationFunctions.idValidator(eventId);
    if (!parentComment) {
        validationFunctions.idValidator(parentComment);
    }
    validationFunctions.contentValidator(content);

    // Cleaning: Triming data before saving
    userId = userId.trim();
    eventId = eventId.trim();
    parentCommentId = parentCommentId.trim();
    content = content.trim();

    // Current timestamp
    timestamp = new Date().toUTCString();

    // If parentComment comes in empty, means this comment is a parent comment itself. So this comment's parent_comment_id will be null.
    if (!parentCommentId) {
        parentCommentId = null;
    }

    let commentsCollection = await comments();

    // Creating new comment object
    let newComment = {
        author_id: userId,
        event_id: eventId,
        parent_comment_id: parentCommentId,
        content: content,
        timestamp: timestamp
    }

    let insertComment = await commentsCollection.insertOne(newComment);
    if (!insertComment.acknowledged || insertComment.insertedCount === 0) {
        throw {statusCode: 500, error: "Internal Server Error: The Comment was not added to the Database"};
    }

    // Now fetch the newly inserted comment and return it to be rendered on page.
    let newCommentID = insertComment.insertedId;
    let getNewComment = await commentsCollection.findOne({_id: newCommentID});
    if (!getNewComment){
        throw {statusCode: 404, error: "Not able to fetch New comment"}
    } 

    return getNewComment;
};


// This function get all comments for the particular event.
const getAllEventParentComments = async (eventId) => {
    // validation
    validationFunctions.idValidator(eventId);

    eventId = eventId.trim();

    let commentsCollection = await comments();
    let commentsList = await commentsCollection.find({$and: [{event_id: ObjectId(eventId)}, {parent_comment_id: null}]});

    return commentsList;
};

const getAllChildCommentsThread = async (parentCommentId) => {
    // validation
    validationFunctions.idValidator(parentCommentId);

    parentCommentId = parentCommentId.trim();

    let commentsCollection = await comments();
    let commentsList = await commentsCollection.find({parent_comment_id: ObjectId(parentCommentId)}).sort({"timestamp": -1});

    return commentsList;
};


module.exports = {
    createComment,
    getAllEventParentComments,
    getAllChildCommentsThread
};