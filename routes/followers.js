const express = require('express');
const router = express.Router();
const data = require('../data');
const followersData = data.followers;
const validationFunctions = data.validationFunctions;

router
    // .route('/comments/:eventID')
    .route('/followers')
    .get(async (req,res) => {
        validationFunctions.idValidator(req.params.eventId);
        
    })