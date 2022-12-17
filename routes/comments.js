const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const validationFunctions = data.validationFunctions;

router
    .route('/create')
    .post(async (req,res) => {
        //code for POST here
        try{
            const userID = req.session.login.loggedUser._id
            const eventID = req.body.eventID
            const parentID = req.body.parentID;
            const content = req.body.content;
            //VALIDATIONS
            await validationFunctions.idValidator(userID);
            await validationFunctions.idValidator(eventID);
            await validationFunctions.idValidator(parentID);
            await validationFunctions.contentValidator(content);
            commentData.createComment(userID, eventID, parentID, content);
            
        }catch(e){
            throw {statusCode: 500, error: e};

        }
    })
    .get(async(req,res) => {
            validationFunctions.idValidator(req.params.eventID);
            const allParentComments = await commentData.getAllEventParentComments(req.params.eventID);
            res.send(allParentComments);
    })

// likes 


module.exports = router;