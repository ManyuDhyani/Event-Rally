const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const comments = mongoCollections.comment;

const createComment = async (parentComment, content) => {
    // validation
    // NOT NULL,string, lenght not zero AFTERN TRIM, 200 WORDS 

    if (!parentComment) {
        validationFunctions.idValidator(parentComment);
    }

    validationFunctions.contentValidator(content);


    parentComment = parentComment.trim();
    content = content.trim();

    // Current timestamp
    timestamp = new Date().toUTCString();

    // If parentComment comes in empty, means this comment is a parent comment itself. So this comment's parent_comment_id will be null.
    if (!parentComment) {
        parentComment = null;
    }

    let commentsCollection = await comments();

    // Creating new comment object
    let newComment = {
        parent_comment_id: parentComment,
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

module.exports = {
    createComment
};