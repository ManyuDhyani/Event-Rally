const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const reports = mongoCollections.report;

const createReport = async (userId, against, complaint) => {
    // validation
    
    validationFunctions.idValidator(userId);
    validationFunctions.againstValidator(against);
    validationFunctions.complaintValidator(complaint);

    userId = userId.trim();
    against = against.trim();
    complaint = complaint.trim();

    // Current timestamp
    timestamp = new Date().toUTCString();

    let reportsCollection = await reports();

    // Creating new report object
    let newReport = {
        user_id: userId,
        against: against,
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

module.exports = {
    createReport
};