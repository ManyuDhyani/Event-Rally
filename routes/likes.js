const express = require('express');
const router = express.Router();
const data = require('../data');
const likeData = data.likes;
const validationFunctions = data.validationFunctions;

router
    // .route('/comments/:eventID')
    .route('/likes/:eventID')
    // .get(async (req,res) => {
    //     validationFunctions.idValidator(req.params.eventID);

    // })

    .post(async(req,res) => {
        if(req.params.value === "like"){
            try {
                validationFunctions.idValidator(req.params.eventID);
                validationFunctions.idValidator(req.session.userId);
                validationFunctions.valueValidator(req.params.value);

                likeData.createLike(req.params.eventID,req.session.userId,req.params.value);
                
            } catch (error) {
                throw {statusCode: 500, error: e};
            }
            
        }
    })

    .delete(async(req,res) => {

    })

module.exports = router; 