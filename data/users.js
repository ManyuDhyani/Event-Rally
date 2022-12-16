const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
let { ObjectId } = require('mongodb');

const createUser = async(username, email, age, password) => {

    // Validations
    await validationFunctions.usernameValidator(username);
    await validationFunctions.emailValidator(email);
    await validationFunctions.ageValidator(age);
    await validationFunctions.passwordValidator(password);

    username = username.trim();
    email = email.trim();
    age = age.trim();

    // Checking if the username and email already exists
    const userCollection = await users();
    username = username.toLowerCase();
    email = email.toLowerCase();

    let userExist = await userCollection.findOne({username: username});
    if (userExist) throw {statusCode: 400, error: "Already a user with that username exist in the Database"};
    let emailExist = await userCollection.findOne({email: email});
    if (emailExist) throw {statusCode: 400, error: "Already a user with that email exist in the Database"};

    let active = true;
    let admin = false;
    let verified = false;
    let timestamp_joined = new Date().toUTCString();

    let encryptedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
        username: username,
        email: email,
        age: age,
        password: encryptedPassword,
        active: active,
        admin: admin,
        verified: verified,
        timestamp_joined: timestamp_joined,
        };
    
    let insertUser = await userCollection.insertOne(newUser);
    
    if(!insertUser.acknowledged || !insertUser.insertedId)
    throw {statusCode: 500, error: "Internal server error: User cannot be added"};

    return {insertedUser: true};
}

const checkUser = async (username, password) => { 

    // Validations
    await validationFunctions.usernameValidator(username);
    await validationFunctions.passwordValidator(password);
  
    let userCollection = await users();
  
    // Convert to lower Case before saving the username
    username = username.toLowerCase();
  
    // Check if user with the username exist in the database
    let userExist = await userCollection.findOne({username: username});
    if (!userExist) throw {statusCode: 400, error: "Either the username or password is invalid"};
  
    let comparePswd = await bcrypt.compare(password, userExist.password);
    if(!comparePswd) throw {statusCode: 400, error: "Either the username or password is invalid"};

    userExist._id = userExist._id.toString();
    return {loggedUser: userExist, authenticatedUser: true};
  };

const getAllUsers = async () => {
    const userCollection = await users();
    const userList = await userCollection.find({}, {projection:  {_id: 1, verified: 1, active: 1, username: 1, email: 1, admin: 1, age: 1}}).toArray();

    if(!userList){
      throw {statusCode: 500, error: "Internal server error: Cannot get all Users"};
    }

    return userList;
};

// Get particular users data except password
const getUsersData = async (userID) =>{
    validationFunctions.idValidator(userID);
    userID = userID.trim();

    const userCollection = await users();
    let userData = await userCollection.findOne({_id: ObjectId(userID)});
    return userData;
};


// Update any user fields
const updateVerifiedFieldData = async(userID) => {
    validationFunctions.idValidator(userID);
    userID = userID.trim();

    userData = await getUsersData(userID)
    
    let updatedData = {}
    // Make verified true if its false and vice-versa
    if (userData.verified === true){
        updatedData = {
            verified: false
        }
    } else {
        updatedData = {
            verified: true
        }
    }
   
    const userCollection = await users();
    let verifiedValue = await userCollection.updateOne(
        {_id: ObjectId(userID)},
        {$set: updatedData}
    );
    let verifiedUpdated = false;
    if (verifiedValue.modifiedCount === 0){
        return verifiedUpdated = false
    }
   
    return verifiedUpdated = true
}

module.exports = {
    createUser,
    checkUser,
    getAllUsers,
    getUsersData,
    updateVerifiedFieldData
}