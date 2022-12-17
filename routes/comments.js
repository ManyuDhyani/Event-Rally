const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const validationFunctions = data.validationFunctions;
const xss = require('xss');

router
    .route('/create')
    .post(async (req,res) => {
        //code for POST here
        try {
            if (req.session.login){
                const userID = req.session.login.loggedUser._id;
                const eventID = xss(req.body.eventID);
                const username = req.session.login.loggedUser.username;
                const content = xss(req.body.content);

                //VALIDATIONS
                await validationFunctions.idValidator(userID);
                await validationFunctions.idValidator(eventID);
                await validationFunctions.usernameValidator(username);
                await validationFunctions.contentValidator(content);
                
                let parentCommentID = null
                if (req.body.parentCommentID){
                    parentCommentID = xss(req.body.parentCommentID)
                    await validationFunctions.idValidator(parentCommentID)
                }

                // Here as it is a parent comment: parentID value will be null
                await commentData.createComment(userID, eventID, username, parentCommentID, content);
                return res.redirect(`/events/${eventID}`)
            }
            
        } catch(e) {
            if (e.statusCode) {
                res.status(e.statusCode).render("error", {title: "Error", error404: true});
              } else {
                res.status(500).json("Internal Server Error");
            }
        }
    });

router
    .delete('/delete', async (req, res) => {
        try {
            if (req.session.login){
                const eventID = xss(req.body.eventID);
                const commentID = xss(req.body.commentID);

                await validationFunctions.idValidator(eventID);
                await validationFunctions.idValidator(commentID);

                let success = await commentData.deleteComment(commentID);
                if (success.isDeleted){
                    return res.redirect(`/events/${eventID}`)
                } else {
                    return res.render("error", {title: "Error", error500: true})
                }
            }
        } catch(e) {
            if (e.statusCode) {
                res.status(e.statusCode).render("error", {title: "Error", error404: true});
              } else {
                res.status(500).json("Internal Server Error");
            }
        }
});
  


router
    .route('/child-comments/:id')
    .get(async(req,res) => {
        try{
            let parentCommentID= req.params.id;
            validationFunctions.idValidator(parentCommentID);
            let allParentComments = await commentData.getAllChildCommentsThread(parentCommentID);
            res.send(allParentComments);
        } catch (e) {
            if (e.statusCode) {
                res.status(e.statusCode).render("error", {title: "Error", error404: true});
              } else {
                res.status(500).json("Internal Server Error");
            }
        }
    });

module.exports = router;