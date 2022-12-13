const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const validationFunctions = data.validationFunctions;

// post(parentID, content)
// delete(:id)
router
    // .route('/comments/:eventID')
    .route('/comments/:eventID')
    .post(async (req,res) => {
        //code for POST here
        try{
            const parentID = req.body.parentID;
            // const allComments = await commentData.getAllComments();
            const content = req.body.content;
            if(parentID === null){
                validationFunctions.contentValidator(content);
                commentData.createComment(parentID,content);
            }
            //VALIDATIONS
            else{
                validationFunctions.idValidator(parentID);
                validationFunctions.contentValidator(content);
                commentData.createComment(parentID,content);
            }
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