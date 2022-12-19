const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');

const router = express.Router();

// backend/routes/api/users.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { where } = require('sequelize');
const e = require('express');
// ...




//Add an Image to a Review based on the Review's id

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const reviewId = req.params.reviewId
    const { url } = req.body

    const specificReview = await Review.findByPk(reviewId, {
        include: {
            model: ReviewImage
        }
    });

    if (!specificReview) {
        res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }
    if (specificReview.ReviewImages.length >= 10) {
        res.status(403).json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
        })
    }

    const createdReviewImage = await ReviewImage.create({ reviewId, url })
    const imgjson = createdReviewImage.toJSON()
    delete imgjson.reviewId;
    delete imgjson.createdAt;
    delete imgjson.updatedAt;

    res.json(imgjson)

})


router.get('/current', requireAuth, async (req, res) => {
    const currentUserId = req.user.id
    const writtenReviews = await Review.findAll({
        where: {
            userId: currentUserId
        },
        include: [
            {
                model: Spot,
                include: {
                    model: SpotImage
                }
            },
            {
                model: ReviewImage
            },
            {
                model: User
            }]
    })
    const jsonwrittenreviews = []
    writtenReviews.forEach(element => {
        jsonwrittenreviews.push(element.toJSON())
    });


    jsonwrittenreviews.forEach(element => {
        delete element.User.username
        delete element.Spot.description
        delete element.Spot.createdAt
        delete element.Spot.updatedAt
        element.ReviewImages.forEach(element1 => {
            delete element1.reviewId
            delete element1.createdAt
            delete element1.updatedAt
        })
        element.Spot.SpotImages.forEach(element2 => {
            if (element2.preview) {
                element.Spot.previewImage = element2.url
            } else {
                element.Spot.previewImage = "There are no immages at this time"
            }
        })
        delete element.Spot.SpotImages

    })
    const format = { Reviews: jsonwrittenreviews }

    res.json(format)

})

//EDIT A REVIEW
router.put('/:reviewId', requireAuth, async (req, res) => {
    const reviewId = req.params.reviewId
    const { review, stars } = req.body
    const specificReview = await Review.findByPk(reviewId)

    if (!specificReview) {
        res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }


    const dataArray = [review, stars]

    dataArray.forEach(element => {
        if (!element) {
            res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": {
                    "review": "Review text is required",
                    "stars": "Stars must be an integer from 1 to 5",
                }
            })
        }
    })

    const editedReview = await specificReview.set({ review, stars })
    editedReview.save()
    res.json(editedReview)

})
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const reviewId = req.params.reviewId;

    const specificReview = await Review.findOne({
        where: {
            id: reviewId
        }
    })

    if (!specificReview) {
        return res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }


    if (specificReview.userId !== req.user.id) {
        const err = new Error('You are not the owner of this review')
        err.status = 403
        throw err
    }

    await specificReview.destroy()
    return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

module.exports = router;
