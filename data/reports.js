const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const reports = mongoCollections.report;
const users = mongoCollections.users;
const event = mongoCollections.event;
const comments = mongoCollections.comments;
let { ObjectId } = require('mongodb');
const mongoConnection = require('../config/mongoConnection');

const createReport = async (userId, against, againstId, complaint) => {
    // validation
    
    await validationFunctions.idValidator(userId);
    await validationFunctions.againstValidator(against);
    await validationFunctions.idValidator(againstId);
    await validationFunctions.complaintValidator(complaint);

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
 

    return {successfullySubmitted: false}
};

const getAllReports = async (userId) => {
    // validation
    await validationFunctions.idValidator(userId);

    userId = userId.trim();

    // First check if current user is admin or regular user
    // Reports data can only be seen by admin
    let userCollection = await users();
    
    let checkAdmin = await userCollection.findOne({_id: ObjectId(userId)});
    if (!checkAdmin){
        throw {statusCode: 404, error: `No user in database with id ${userId}`};
    }

    if(checkAdmin.admin === true){
        let reportsCollection = await reports();
        let reportsData = await reportsCollection.find({}).sort({"timestamp": -1}).toArray();
        if (reportsData.length === 0){
            return {noReports: true}
        }
        return reportsData;
    }else{
        throw {statusCode: 403, error: "Forbidden to access the report data"};
    }
};

const deleteReportWithReportedItem = async (reportId) => {
    // validation
    await validationFunctions.idValidator(reportId);

    reportId= reportId.trim();

    let reportsCollection = await reports();
    let userCollection = await users();
    let eventCollections = await event();
    let commentsCollection = await comments();

    // If not reports in db return
    let allReportData = await reportsCollection.find({}).toArray();
    if (allReportData.length === 0){
        return {noReports: true}
    }

    let getReportData = await reportsCollection.findOne({_id: ObjectId(reportId)});
    if (getReportData.against == "user") {
        let userToBeDeleted = await userCollection.deleteOne({_id: ObjectId(getReportData.against_id)});
        if (userToBeDeleted.deletedCount === 0) {
            throw {statusCode: 500, error: "Internal Server Error: The user could not be deleted"};
        }
    } else if (getReportData.against == "event") {
        let eventToBeDeleted = await eventCollections.deleteOne({_id: ObjectId(getReportData.against_id)});
        if (eventToBeDeleted.deletedCount === 0) {
            throw {statusCode: 500, error: "Internal Server Error: The event could not be deleted"};
        }
    } else if (getReportData.against == "comment"){
        let commentToBeDeleted = await commentsCollection.deleteOne({_id: ObjectId(getReportData.against_id)});
        if (commentToBeDeleted.deletedCount === 0) {
            throw {statusCode: 500, error: "Internal Server Error: The comment could not be deleted"};
        }
    } else {
        return {success: false}
    }
    let reportToBeDeleted = await reportsCollection.deleteMany({against_id: getReportData.against_id});
    if (reportToBeDeleted.deletedCount === 0) {
        throw {statusCode: 500, error: "Internal Server Error: The report could not be deleted"};
    }
    return {success: true}
};


module.exports = {
    createReport,
    getAllReports,
    deleteReportWithReportedItem 
};