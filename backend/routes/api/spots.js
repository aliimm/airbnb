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

// const { requireAuth } = require('../../utils/auth');


//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async(req,res) => {
    const currentUser = req.user.id
    const currentSpot = req.params.spotId
    const {review, stars} = req.body
    const something = await Review.findAll({
        where: {
            spotId: currentSpot
        }

    })
    const spot = await Spot.findAll({
        where: {
            id: currentSpot
        }
    })
    if(!spot.length){
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    for(let review of something){
        if(review.userId === currentUser){
            res.status(403).json({
                "message": "User already has a review for this spot",
                "statusCode": 403
            })
        }
    }


    const dataArray = [review, stars]
    dataArray.forEach(element => {
        if(!element){
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

    const createdreview = await Review.create({userId: req.user.id, spotId: currentSpot, review, stars})
    res.json(createdreview)
})




//Delete a Spot
router.delete('/:spotId',requireAuth, async(req,res) => {
    const inputSpot = req.params.spotId
    const specificspot = await Spot.findOne({
        where: {
            id: inputSpot
        }
    })
    if (specificspot){
        await specificspot.destroy()
        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
          })
    }



    if(!specificspot){
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }


    res.json(specificspot)

})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async(req,res) => {
    const spot = req.params.spotId
    const spotReview = await Review.findAll({
        where: {
            spotId: spot
        },
        include: [
            {
                model: User
            },
            {
                model: ReviewImage
            }]
    })
    if(!spotReview.length){
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }

    spotlist = []
    spotReview.forEach(element => {
        spotlist.push(element.toJSON())

    })


    spotlist.forEach(usr => {
       delete usr.User.username
       usr.ReviewImages.forEach( ele =>{
       delete ele.createdAt
       delete ele.updatedAt
       delete ele.reviewId


       })
    })

    res.json(spotlist)



})




//Edit a Spot
router.put('/:spotId', requireAuth, async(req,res) => {
const currentUserId = req.params.spotId
const {address, city, state, country, lat, lng, name, description, price} = req.body
const specificSpot = await Spot.findByPk(currentUserId)
const dataArray = [address, city, state, country, lat, lng, name, description, price]

dataArray.forEach(element => {
    if(!element){
        res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
              "address": "Street address is required",
              "city": "City is required",
              "state": "State is required",
              "country": "Country is required",
              "lat": "Latitude is not valid",
              "lng": "Longitude is not valid",
              "name": "Name must be less than 50 characters",
              "description": "Description is required",
              "price": "Price per day is required"
            }
          })
    }
})

if (specificSpot){
    specificSpot.update(req.body)
}else {
    res.status(404).json({
        message: "Spot couldn't be found",
        statuscode: 404
      })
}
})

//Create a Spot
router.post('/', requireAuth, async(req,res) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body
    const spot = await Spot.create({ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price})
    res.json(spot)

})


//Get all Spots owned by the Current User
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
    const format = {}
    format.Spots = spotsList
    res.json(format)
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
        res.status(404).json({
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
    // if(!spots.Reviews.length) {
    //     spots.ratings = 'no ratings'
    //     delete spotlist.Reviews
    // }
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
