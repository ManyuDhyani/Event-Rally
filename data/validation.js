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

// ##Username Validations
const usernameValidator = async (username) => {
    if (typeof username !== "string") throw {statusCode: 400, error: "Username should be a valid string"};
    if (username.trim().length === 0) throw {statusCode: 400, error: "Username cannot be just empty spaces"};
    let checkSpaces = username.split(" ");
    if (checkSpaces.length > 1) throw {statusCode: 400, error: "No spaces in the username is allowed"};
    if (/^[0-9a-zA-Z]+$/.test(username) === false) throw  {statusCode: 400, error: "Username can be only alphanumeric characters"};
    if (username.length < 5) throw {statusCode: 400, error: "Username should be at least 4 characters long"};
};

// ##Password Validations
const passwordValidator = async (password) => {
    if (typeof password !== "string") throw {statusCode: 400, error: "Password should be a valid string"};
    checkSpaces = password.split(" ");
    if (checkSpaces.length > 1) throw {statusCode: 400, error: "No spaces in the password is allowed"};

    /* 
        Password Regex Validation breakdown:
        (?=.*[0-9]) means that the password must contain a single digit from 1 to 9.
        (?=.*[a-z]) means that the password must contain one lowercase letter.
        (?=.*[A-Z]) means that the password must contain one uppercase letter.
        (?=.*\W) means that the password must contain one special character.
        .{8,16} means that the password must be 8-16 characters long. We must use this at the end of the regex, just before the $ symbol.
    */

    if (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(password) === false) throw {statusCode: 400, error: "Password must contain a single digit from 1 to 9, one lowercase letter, one uppercase letter, one special character and must be 8-16 characters long."};
    // if (password.length < 8 and password.length > 16) throw {statusCode: 400, error: "Password should be at least 8 characters long and less than 16 character"};
};

// ##Email Validation
const emailValidator = async (email) => {
    if (typeof email !== "string") throw {statusCode: 400, error: " Email should be a valid string"};
    if (email.trim().length === 0) throw {statusCode: 400, error: " Email cannot be just empty spaces"};
    let checkSpaces = email.split(" ");
    if (checkSpaces.length > 1) throw {statusCode: 400, error: "No spaces in the Email is allowed"};
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) throw  {statusCode: 400, error: "Email should be Valid"};
};

// ##Boolean Field Validation: active, admin and verified

const booleanValidator = async (active, admin, verified) => {
    if (!active || !admin || !verified) throw {statusCode: 400, error: "Active, Admin, Verified boolean should be provided"};
    if (typeof active !== "boolean" || typeof admin !== "boolean"  || typeof verified !== "boolean" ) throw {statusCode: 400, error: "Active, Admin, Verified boolean should be a valid boolean"};
};

// Error handling for profile
//link validator regex, pin code and age(no spe char), bio(char limit 100 words.), country state city(no number),
const profileValidator = async(first_name, last_name, Age, Gender, website_link, youtube_link, Address_line_1, Address_line_2, City, State, Country, pincode, Bio) => {
    
}

const ageValidator = async(age) => {
    
};

// Error handling for events

// Error handling for likes
const valueValidator = async(value) => {
    if(!value) throw {statusCode: 400, error: "Value cannot be empty"};
    if(typeof(value)!== "string") throw {statusCode: 400, error: "Value should be a string"};
    if(value.trim().length === 0) throw {statusCode: 400, error: "Value cannot be empty"};
    if(value!=="like" || value!=="dislike") throw {statusCode: 400, error: "Value should be either like or dislike"};
}



// Error handling for followers

// Error handling for comments
const contentValidator = async(content) => {
    if(!content) throw {statusCode: 400, error: "Content field cannot be empty"};
    if(typeof(content)!=="string")  throw {statusCode: 400, error: "Content field should be a string"};
    if(content.trim().length===0)  throw {statusCode: 400, error: "Content field cannot be empty"};
    if(content.length <= 200) throw {statusCode: 400, error: "Number of words allowed are upto 200."};

}


// Error handling for reports

const againstValidator = async(against) => {
    if(!against) throw {statusCode: 400, error: "This field cannot be empty"};
    if(typeof(against)!=="string") throw {statusCode: 400, error: "This field should be a string"};
    if(against!=="user" || against!=="event" || against!=="comment") throw {statusCode: 400, error: "Complaint report should be against user, event or comment"};

}

const complaintValidator = async(complaint) => {
    if(!complaint) throw {statusCode: 400, error: "This field cannot be empty"};
    if(typeof(complaint)!=="string") throw {statusCode: 400, error: "Complaint should be a string"};
    if(complaint.trim().length===0) throw {statusCode: 400, error: "This field cannot be empty"};
}


module.exports = {
    idValidator,
    usernameValidator,
    passwordValidator,
    emailValidator,
    booleanValidator,
    valueValidator,
    againstValidator,
    complaintValidator,
    contentValidator,
    ageValidator
};