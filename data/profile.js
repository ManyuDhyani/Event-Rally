const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('../data/validation');
const profile = mongoCollections.profile;
let { ObjectId } = require('mongodb');

//return all the objects
const createProfile = async(userId,
    firstName,
    lastName,
    age,
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
    // Validations

    await validationFunctions.idValidator(userId);

    userId = userId.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    age = age.trim();
    gender = gender.trim();
    addressLine1 = addressLine1.trim();
    addressLine2 = addressLine2.trim();
    city = city.trim();
    state = state.trim();
    country = country.trim();
    pincode = pincode.trim();
    bio = bio.trim();

    let newProfile = {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        age: age,
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
    let profileCollection = await profile();
    

    let result = await profileCollection.insertOne(newProfile);

    if (result.modifiedCount === 0) {
        throw { statusCode: 500, error: `Unable to add profile` };
    }

    return newProfile;


};






const updateProfile = async(userId, firstName, lastName, age, gender, profilePicture, websiteLink, youtubeLink, addressLine1, addressLine2, city, state, country, pincode, bio) => {


    //compare with create profile if not updated then throw error.
    await validationFunctions.idValidator(userId);

    //userId = userId.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    age = age.trim();
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
    console.log(profile1);
    if (!profile1) {
        throw { statusCode: 404, error: `No such profile ` }
    }

    // Check for updated fields.
    if (
      profile1.firstName === firstName &&
      profile1.lastName === lastName &&
      profile1.age === age &&
      profile1.gender === gender &&
      profile1.addressLine1 === addressLine1 &&
      profile1.addressLine2 === addressLine2 &&
      profile1.city === city &&
      profile1.state === state &&
      profile1.country === country &&
      profile1.pincode === pincode &&
      profile1.bio === bio
    ) {
        throw { statusCode: 400, error : `Atleast one changes need to be done in order to Update.`}
    }

    let newProfile = {
        //userId: userId,
        firstName: firstName,
        lastName: lastName,
        age: age,
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
    console.log(result);
    if (result.modifiedCount === 0) {
        throw { statusCode: 500, error: `Unable to update profile` };
    }
    let updatedProfile = await profileCollection.findOne({ userId: userId });
    if (!updatedProfile) {
        throw { statusCode: 404, error: `Unable to get profile` };
    }

    return updateProfile;


};

module.exports = {
    createProfile,
    updateProfile

};