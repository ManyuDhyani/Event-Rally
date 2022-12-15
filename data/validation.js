let { ObjectId } = require('mongodb')

// All validation functions for Error Handling

// Error Validation for common fields

// Error handling for various ID objects like userID, profileID, eventID, followersID, reportID, LikesID, commentsID
const idValidator = async (id) => {

    if (!id){ 
        throw {statusCode: 400, error:'Error: id cannot be empty'};
    }
    if (typeof id !== "string"){ 
        throw {statusCode: 400, error:'Error: id must be a string'};
    }
    if (id.length === 0 || id.trim().length === 0){
        throw {statusCode: 400, error:'Error: id cannot be an empty string or just spaces'};
    }

    id = id.trim();
  
    if (!ObjectId.isValid(id)){ 
        throw {statusCode: 400, error: "Error: Invalid object ID"};
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


//Tags splitter
const tagsSplitter = async(tags_string) =>{

    let reg = /#/;
    let reg1= /^#/;
    let reg2 = /^ /;
    let reg3 =/ /;

    if(!reg.test(tags_string))
    {
        throw {statusCode: 400, error: "tags should include # before every tag"};
    }

    if(!reg1.test(tags_string) && !reg2.test(tags_string))
    {
        throw {statusCode: 400, error: "tags should include # before every tag"};
    }
   
    let temp = tags_string.split('#');
    let tags = [];
    let k=0;

    for(let i=1;i<temp.length;i++)
    {
        temp[i]=temp[i].trim();
        if(reg3.test(temp[i]))
        {
            throw {statusCode: 400, error: "Tags should have only words not sentences with spaces"};
        }
        tags[k]=temp[i];
        k++;
    }

    return tags;
}

// Error handling for events
//userId,title,overview,content, category, thumbnail1,thumbnail2,thumbnail3,thumbnail4, tags, location, price
//title - 100
//overivew - 400
const eventObjValidator = async (flag,eventId,userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags_str, location, price) => {

    if(!userId || !title || !overview || !content || !category  || !tags_str || !location || !price)
    {
        throw {statusCode: 400, error: "All the required fields must be present"};
    }
    
    if(typeof(userId)!=='string' || typeof(title)!=='string' || typeof(overview)!=='string' || typeof(content)!=='string' || typeof(location)!=='string' || typeof(price)!=='string' || typeof(tags_str)!=='string')
    {
        throw {statusCode: 400, error: "All values must be valid strings"};
    }

    if(userId.trim().length==0 ||title.trim().length==0 ||overview.trim().length==0 ||content.trim().length==0 ||category.trim().length==0 ||tags_str.trim().length==0 || location.trim().length==0 || price.trim().length==0)
    {
        throw {statusCode: 400, error: "No empty values accepted for the requires fields"};
    }

    //tags 
    let tags = await tagsSplitter(tags_str);

    if(typeof(tags)!=='object' || Array.isArray(tags)!==true)
    {
        throw {statusCode: 400, error: "Tags should be an array with valid values"};
    }

    for(let i = 0; i<tags.length;i++)
    {
        if(typeof(tags[i])!=='string')
        {
            throw {statusCode: 400, error: "All tags should be valid strings"};
        }
    }

    //title
    if(title.trim().length>100)
    {
        throw {statusCode: 400, error: "Title character limit of 100 exceeded"};
    }

    //overview
    if(overview.trim().length>400)
    {
        throw {statusCode: 400, error: "Overivew character limit of 400 characters exceeded"};
    }
   
    //location 

 
    //price
    let reg = /^[0-9.,]+$/
    if(price===".")
    {
        price = "0.00";
    }
    if(reg.test(price)===false)
    {
        throw {statusCode: 400, error: "Enter a valid value for price"};
    }
    
    if(price.includes("."))
    {
        substr = price.split('.');
        if(substr[1].length>2)
        {
            throw {statusCode: 400, error: "Enter a price till 2 decimals only"}; 
        }
    }
    if(flag===1)
    {
        if(!ObjectId.isValid(eventId))
        {
            throw {statusCode: 400, error: "Event ID is not a valid ID"}; 
        }
    }
    return tags;
}

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


const pincodeValidator = async(num) => {
    var num2 = Number.parseInt(num);
    if (!num) {
        throw 'Error: Pincode cannot be empty';
    }

    if (Number.isNaN(num2)) {
        throw 'Error: Pincode value should be a numeric...String Given';
    }
    if (num.length === 0 || num.trim().length === 0) {
        throw 'Error: Pincode Value cannot be an empty  or just spaces';
    }

    // string
    // no alphabet

};

const ageValidator = async(num) => {
    var num2 = Number.parseInt(num);
    if (!num) {
        throw 'Error: Age cannot be empty';
    }

    if (Number.isNaN(num2)) {
        throw 'Error: Age should be a numeric';
    }
    if (num.length === 0 || num.trim().length === 0) {
        throw 'Error: Age cannot be an empty  or just spaces';
    }
    if (num <= 13) {
        throw 'Error: Age should be greater than 13';
    }

};

const genderValidator = async(gender) => {
    gender = gender.trim();

    if (typeof gender !== "string") {
        throw 'Error: Gender must be a string';
    }

    if (gender.length === 0 || gender.trim().length === 0) {
        throw 'Error: Gender cannot be an empty string or just spaces';
    }

    if (gender !== "Male" && gender !== "Female" && gender !== "Transgender" && gender !== "NoNBinary") {
        throw 'Error: Gender must be either Male, Female ,Transgender or Binary...Anything else will not accepted';
    }

};


const firstNameValidator = async(str) => {
    if (!str) {
        throw 'Error: First Name cannot be empty';
    }

    if (typeof str !== "string") {
        throw 'Error: First Name must be a string';
    }
    if (str.length === 0 || str.trim().length === 0) {
        throw 'Error: First Name cannot be an empty string or just spaces';
    }
};

const lastNameValidator = async(str) => {
    if (!str) {
        throw 'Error: Last Name cannot be empty';
    }

    if (typeof str !== "string") {
        throw 'Error: Last Name must be a string';
    }
    if (str.length === 0 || str.trim().length === 0) {
        throw 'Error: Last Name cannot be an empty string or just spaces';
    }

};

const cityValidator = async(str) => {
    if (!str) {
        throw 'Error: City cannot be empty';
    }

    if (typeof str !== "string") {
        throw 'Error: City must be a string';
    }
    if (str.length === 0 || str.trim().length === 0) {
        throw 'Error: City cannot be an empty string or just spaces';
    }

};

const stateValidator = async(str) => {
    if (!str) {
        throw 'Error: State cannot be empty';
    }

    if (typeof str !== "string") {
        throw 'Error: State must be a string';
    }
    if (str.length === 0 || str.trim().length === 0) {
        throw 'Error: State cannot be an empty string or just spaces';
    }

};

const countryValidator = async(str) => {
    if (!str) {
        throw 'Error: Country cannot be empty';
    }

    if (typeof str !== "string") {
        throw 'Error: Country must be a string';
    }
    if (str.length === 0 || str.trim().length === 0) {
        throw 'Error: Country cannot be an empty string or just spaces';
    }

};

module.exports = {
    idValidator,
    usernameValidator,
    passwordValidator,
    emailValidator,
    booleanValidator,
    eventObjValidator,
    valueValidator,
    againstValidator,
    complaintValidator,
    contentValidator,
    tagsSplitter,
    firstNameValidator,
    lastNameValidator,
    cityValidator,
    stateValidator,
    countryValidator,
    pincodeValidator,
    ageValidator,
    genderValidator
};