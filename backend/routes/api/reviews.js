const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage} = require('../../db/models');

const router = express.Router();

// backend/routes/api/users.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { where } = require('sequelize');
const e = require('express');
// ...




//Add an Image to a Review based on the Review's id

router.post('/:reviewId/images', requireAuth, async(req,res) => {
    const currentReviewId = req.params.reviewId
    const {url} = req.body
    const  createdReviewImage = await ReviewImage.create({reviewId: currentReviewId, url})

    const specificReview = await Review.findAll({
        where: {
            reviewId: currentReviewId
        }
    })

    if(!specificReview.length){
        res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
          })
    }



    res.json(createdReviewImage)

})


// router.get('/current',requireAuth, async(req,res) => {
//     const currentUserId = req.user.id
//     const writtenReviews = await Review.findAll({
//         where: {
//             userId: currentUserId
//         },
//         // include:[
//         // {
//         //     model: Spot
//         // },
//         // {
//         //     model: ReviewImage
//         // }]
//     })

//     res.json(currentUserId)
// })


module.exports = router;
