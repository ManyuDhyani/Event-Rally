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



// Error handling for events

// Error handling for likes

// Error handling for followers

// Error handling for comments

// Error handling for reports


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
};