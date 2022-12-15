const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const reports = mongoCollections.report;
let { ObjectId } = require('mongodb');

const createReport = async (userId, against, againstId, complaint) => {
    // validation
    
    validationFunctions.idValidator(userId);
    validationFunctions.againstValidator(against);
    validationFunctions.idValidator(againstId);
    validationFunctions.complaintValidator(complaint);

    userId = userId.trim();
    against = against.trim();
    againstId = againstId.trim();
    complaint = complaint.trim();

    // Current timestamp
    timestamp = new Date().toUTCString();

    let reportsCollection = await reports();

    // Creating new report object
    let newReport = {
        user_id: userId,
        against: against,
        against_id: againstId,
        complaint: complaint,
        timestamp: timestamp
    }

    let insertReport = await reportsCollection.insertOne(newReport);
    if (!insertReport.acknowledged || insertReport.insertedCount === 0) {
        throw {statusCode: 500, error: "Internal Server Error: The Report was not added to the Database"};
    }

    // Now fetch the newly inserted report and return the submission status.
    if (insertReport.acknowledged || insertReport.insertedCount === 1) {
        return {successfullySubmitted: true}
    } 

    return {successfullySubmitted: false}
};

const getAllReports = async (userId) => {
    // validation
    await validationFunctions.idValidator(userId);

    userId = userId.trim();

    // First check if current user is admin or regular user
    // Reports data can only be seen by admin
    let userCollection = await users();
    let checkAdmin = await userCollection.find({_id: ObjectId(userId)});
    if (!checkAdmin){
        throw {statusCode: 404, error: `No user in database with id ${userId}`};
    }

    if(checkAdmin.admin === true){
        let reportsCollection = await reports();
        let reportsData = await reportsCollection.find({}).sort({"timestamp": -1}).toArray();
        return reportsData;
    }else{
        throw {statusCode: 403, error: "Forbidden to access the report data"};
    }
};

module.exports = {
    createReport,
    getAllReports
};