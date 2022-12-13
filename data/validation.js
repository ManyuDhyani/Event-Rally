let { ObjectId } = require('mongodb')

// All validation functions for Error Handling

// Error Validation for common fields

// Error handling for various ID objects like userID, profileID, eventID, followersID, reportID, LikesID, commentsID


// Error handling for profile
const idValidator = async(id) => {

    if (!id) {
        throw 'Error: id cannot be empty';
    }
    if (typeof id !== "string") {
        throw 'Error: id must be a string';
    }
    if (id.length === 0 || id.trim().length === 0) {
        throw 'Error: id cannot be an empty string or just spaces';
    }

    id = id.trim();

    if (!ObjectId.isValid(id)) {
        throw 'Error: Invalid object ID';
    }
};


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



// Error handling for users

// ##Username Validations


// Error handling for profile
//link validator regex, pin code and age(no spe char), bio(char limit 100 words.), country state city(no number),
const profileValidator = async(first_name, last_name, Age, Gender, website_link, youtube_link, Address_line_1, Address_line_2, City, State, Country, pincode, Bio) => {
    
}

const ageValidator = async(age) => {
    
};

// Error handling for events
//userId,title,overview,content, category, thumbnail1,thumbnail2,thumbnail3,thumbnail4, tags, location, price
//title - 100
//overivew - 400
const eventObjValidator = async (flag,eventId,userId,title,overview,content, category, thumbnail_1,thumbnail_2,thumbnail_3,thumbnail_4, tags, location, price) => {
    if(!userId || !title || !overview || !content || !category || !thumbnail_1 || !tags || !location || !price)
    {
        throw {statusCode: 400, error: "All the required fields must be present"};
    }
    
    if(typeof(userId)!=='string' || typeof(title)!=='string' || typeof(overview)!=='string' || typeof(content)!=='string' || typeof(location)!=='string' || typeof(price)!=='string')
    {
        throw {statusCode: 400, error: "All values must be valid strings"};
    }

    if(typeof(tags)!=='object' || Array.isArray(tags)!==true)
    {
        throw {statusCode: 400, error: "Tags should be an array with valid values"};
    }

    if(userId.trim().length==0 ||title.trim().length==0 ||overview.trim().length==0 ||content.trim().length==0 ||category.trim().length==0 ||tags.trim().length==0 || location.trim().length==0 || price.trim().length==0)
    {
        throw {statusCode: 400, error: "No empty values accepted for the requires fields"};
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

    //tags
    for(let i = 0; i<tags.length;i++)
    {
        if(typeof(tags[i])!=='string')
        {
            throw {statusCode: 400, error: "All tags should be valid strings"};
        }
    }
    //location 

    //price
    let reg = /^[0-9.,]+$/
    if(price===".")
    {
        price = "0.00";
    }
    if(reg.test(str4)===false)
    {
        throw {statusCode: 400, error: "Enter a valid value for price"};
    }
    
    if(str4.includes("."))
    {
        substr = str4.split('.');
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


module.exports = {
    idValidator,
    firstNameValidator,
    lastNameValidator,
    cityValidator,
    stateValidator,
    countryValidator,
    pincodeValidator,
    ageValidator,
    genderValidator
    usernameValidator,
    passwordValidator,
    emailValidator,
    booleanValidator,
    eventObjValidator,
    valueValidator,
    againstValidator,
    complaintValidator,
    contentValidator,
    ageValidator
};