let { ObjectId } = require('mongodb')

// All validation functions for Error Handling

// Error Validation for common fields

// Error handling for various ID objects like userID, profileID, eventID, followersID, reportID, LikesID, commentsID
const idValidator = async (id) => {

    if (!id){ 
        throw 'Error: id cannot be empty';
    }
    if (typeof id !== "string"){ 
        throw 'Error: id must be a string';
    }
    if (id.length === 0 || id.trim().length === 0){
        throw 'Error: id cannot be an empty string or just spaces';
    }

    id = id.trim();
  
    if (!ObjectId.isValid(id)){ 
        throw 'Error: Invalid object ID';
    }
};

// Error handling for users

// Error handling for profile

// Error handling for events

// Error handling for likes

// Error handling for followers

// Error handling for comments

// Error handling for reports


module.exports = {
    idValidator
};