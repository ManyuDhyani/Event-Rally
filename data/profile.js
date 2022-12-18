const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('../data/validation');
const hara = mongoCollections.profile
let { ObjectId } = require('mongodb');

//return all the objects
const createProfile = async(userId,
    firstName,
    lastName,
    gender,
    profilePicture,
    websiteLink,
    youtubeLink,
    addressLine1,
    addressLine2,
    city,
    state,
    country,
    pincode,
    bio) => {
    
    await validationFunctions.idValidator(userId);
    await validationFunctions.firstNameValidator(firstName);
    await validationFunctions.lastNameValidator(lastName);
    await validationFunctions.cityValidator(city);
    await validationFunctions.stateValidator(state);
    await validationFunctions.countryValidator(country);
    await validationFunctions.pincodeValidator(pincode);
    await validationFunctions.genderValidator(gender);

    userId = userId.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    gender = gender.trim();
    addressLine1 = addressLine1.trim();
    addressLine2 = addressLine2.trim();
    city = city.trim();
    state = state.trim();
    country = country.trim();
    pincode = pincode.trim();
    bio = bio.trim();

    let newProfile = {
        user_id: userId,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        profilePicture: profilePicture,
        websiteLink: websiteLink,
        youtubeLink: youtubeLink,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        state: state,
        country: country,
        pincode: pincode,
        bio: bio

    }
    let profileCollection = await hara();


    
    let result = await profileCollection.insertOne(newProfile);

    if (result.modifiedCount === 0) {
        throw { statusCode: 500, error: `Unable to add profile` };
    }

    return { insertedProfile: true };


};






const updateProfile = async(userId, firstName, lastName, gender, profilePicture, websiteLink, youtubeLink, addressLine1, addressLine2, city, state, country, pincode, bio) => {


    //compare with create profile if not updated then throw error.
    await validationFunctions.idValidator(userId);
    await validationFunctions.idValidator(userId);
    await validationFunctions.firstNameValidator(firstName);
    await validationFunctions.lastNameValidator(lastName);
    await validationFunctions.cityValidator(city);
    await validationFunctions.stateValidator(state);
    await validationFunctions.countryValidator(country);
    await validationFunctions.pincodeValidator(pincode);
    await validationFunctions.genderValidator(gender);


    userId = userId.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    gender = gender.trim();
    addressLine1 = addressLine1.trim();
    addressLine2 = addressLine2.trim();
    city = city.trim();
    state = state.trim();
    country = country.trim();
    pincode = pincode.trim();
    bio = bio.trim();
    let profileCollection = await profile();
    let profile1 = await profileCollection.findOne({ userId: userId })
    
    if (!profile1) {
        throw { statusCode: 404, error: `No such profile ` }
    }

    // Check for updated fields.
    if (
        profile1.firstName === firstName &&
        profile1.lastName === lastName &&
        profile1.gender === gender &&
        profile1.addressLine1 === addressLine1 &&
        profile1.addressLine2 === addressLine2 &&
        profile1.city === city &&
        profile1.state === state &&
        profile1.country === country &&
        profile1.pincode === pincode &&
        profile1.bio === bio
    ) {
        throw { statusCode: 400, error: `Atleast one changes need to be done in order to Update.` }
    }

    let newProfile = {
        user_id: userId,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        profilePicture: profilePicture,
        websiteLink: websiteLink,
        youtubeLink: youtubeLink,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        state: state,
        country: country,
        pincode: pincode,
        bio: bio

    }
    var newvalues = { $set: newProfile };


    let result = await profileCollection.updateOne({ userId: userId }, newvalues);

    if (result.modifiedCount === 0) {
        throw { statusCode: 500, error: `Unable to update profile` };
    }
    let updatedProfile = await profileCollection.findOne({ userId: userId });
    if (!updatedProfile) {
        throw { statusCode: 404, error: `Unable to get profile` };
    }

};

const getAllProfiles = async() => {


    let profilecollection = await hara();
    const profilelists = await profilecollection.find({}).toArray();

    return profilelists

};

const getProfileById = async(userId) => {
    await validationFunctions.idValidator(userId)
    userId = userId.trim();
    let profilecollection = await hara();
    let profile = await profilecollection.findOne({ user_id: userId });
    if (!profile) {
        return null
    }
    return profile
}

module.exports = {
    createProfile,
    updateProfile,
    getAllProfiles,
    getProfileById
};