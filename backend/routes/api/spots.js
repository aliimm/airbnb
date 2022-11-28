const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage} = require('../../db/models');

const router = express.Router();

// backend/routes/api/users.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { where } = require('sequelize');
// ...

// const { requireAuth } = require('../../utils/auth');


router.get('/current', requireAuth, async(req,res) => {
    const currentUserId = req.user.id
    const currentUserSpot = await Spot.findAll({
        where: {
            ownerId: currentUserId
        }, include:[
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })
    const spotsList = []
    currentUserSpot.forEach(element =>
        spotsList.push(element.toJSON())
        )


    //current user avg rating
    spotsList.forEach(spots => {
        let starsReview = []
        spots.Reviews.forEach(element => {
            if(element.stars){
                starsReview.push(element.stars)
            }  delete spots.Reviews
            if(!element.stars){
                spots.avgRating = 'No Ratings Yet'
            }
            let totalStars = starsReview.reduce((a,b) => a + b)
            spots.avgRating = totalStars/starsReview.length
        })
    })

    // preview image
    spotsList.forEach(spots =>{
        spots.SpotImages.forEach(element => {
            // console.log(element.preview)
            if(element.preview === true){
                // console.log(element)
                spots.previewImage = element.url
            }delete spots.Reviews
        })
        if(!spots.previewImage){
            spots.previewImage = 'no preview image found'
        }
        delete spots.SpotImages
    })


    res.json(spotsList)
})


router.get('/:spotId', async(req, res) => {
    const specificSpot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            },
            {
                model: User
            }
        ]
    })
    if(!specificSpot){
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })

    }
      const specficSpotlist = specificSpot.toJSON()



    // avgStarRating
        let starsReview = []
        specficSpotlist.Reviews.forEach(element => {
            if(element.stars){

                starsReview.push(element.stars)
            }
            let totalStars = starsReview.reduce((a,b) => a + b)
            specficSpotlist.avgStarRating = totalStars/starsReview.length
            //number of reviews
            specficSpotlist.numReviews = starsReview.length

        })
        delete specficSpotlist.Reviews

        specficSpotlist.SpotImages.forEach(element => {
            delete element.spotId
            delete element.createdAt
            delete element.updatedAt

        })

        specficSpotlist.Owner = {
            id: specficSpotlist.User.id,
            firstName: specficSpotlist.User.firstName,
            lastName: specficSpotlist.User.lastName


        }
        delete specficSpotlist.User







    res.json(specficSpotlist)
})



router.get('/', async(req, res) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })

    let spotlist = []
    spots.forEach(element => {
        spotlist.push(element.toJSON())
    });

//avgRating
spotlist.forEach(spots => {
    let starsReview = []
    spots.Reviews.forEach(element => {
        if(element.stars){

            starsReview.push(element.stars)
        }
        let totalStars = starsReview.reduce((a,b) => a + b)
        spots.avgRating = totalStars/starsReview.length

    })

})
//preview image url when returning all spots
    spotlist.forEach(spots =>{
        spots.SpotImages.forEach(element => {
            // console.log(element.preview)
            if(element.preview === true){
                // console.log(element)
                spots.previewImage = element.url
            }delete spots.Reviews
        })
        if(!spots.previewImage){
            spots.previewImage = 'no preview image found'
        }
        delete spots.SpotImages

    })

    res.json(spotlist)

})

module.exports = router
