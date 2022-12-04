const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('../validation');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
let { ObjectId } = require('mongodb');

const createUser = async(username, email, password) => {
    const userCollection = await users();
    const username_present = await userCollection.findone(username);
    const email_present = await userCollection.findone(email);
    if(username_present) throw {statusCode: 400, error: "This username already exists!"};
    if(email_present) throw {statusCode: 400, error: "This email is already registered!"};

    // VALIDATIONS
    
    let active = true;
    let admin = false;
    let verified = false;
    let timestamp_joined = new Date();

    let encryptedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
        username: username,
        email: email,
        password: encryptedPassword,
        active: active,
        admin: admin,
        verified: verified,
        timestamp_joined: timestamp_joined,
        };
    
    const insertInfo = await userCollection.insertOne(newUser);
    
    if(!insertInfo.acknowledged || !insertInfo.insertedId)
    throw {statusCode: 500, error: "Internal server error: User cannot be added"};

    return newUser;
}

const checkUser = async (username, password) => { 

    // Error checking for username and password
    await validationFunc.createValidator(username, password);
  
    let userCollection = await users();
  
    // Convert to lower Case before saving the username
    username = username.toLowerCase();
  
    // Check if user with the username exist in the database
    let userExist = await userCollection.findOne({username: username});
    if (!userExist) throw {statusCode: 400, error: "Either the username or password is invalid"};
  
    let comparePswd = await bcrypt.compare(password, userExist.password);
    if(!comparePswd) throw {statusCode: 400, error: "Either the username or password is invalid"};
  
    return {authenticatedUser: true};
  };

const getAllUsers = async () => {
    const userCollection = await users();
    const userlist = await userCollection.find({}).toArray();
    // console.log(userlist[0].username);
    if(!userlist){
      throw "Could not get all movies";
    }
    let allUsersList = [];
    if(userlist.length!==0){
        for(let i =0;i<userlist.length;i++){
            allUsersList[i] = userlist[i].username; 
        }
    }   
    return allUsersList;
};

module.exports = {
    createUser,
    checkUser,
    getAllUsers
}