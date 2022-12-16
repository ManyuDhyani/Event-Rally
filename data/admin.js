const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const reports = mongoCollections.report;
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const reportFunctions = require('./reports');
const usersFunctions = require('./users');

const allReports = async() => {
    const allReports = await reportFunctions.getAllReports();
    return allReports;
};
const allUsers =  async() => {
    const userCollection = await users();
    const userlist = await userCollection.find({}).toArray();
 
    return userlist;
};

module.exports={
    allReports,
    allUsers,
}
