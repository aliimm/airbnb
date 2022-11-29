const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

// backend/routes/api/users.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { where } = require('sequelize');
const e = require('express');
// ...

// const { requireAuth } = require('../../utils/auth');
router.get('/', async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

    if (minLat) {
        minLat = Number(minLat)
        if (isNaN(minLat)) {
            res.status(400).json({
                "message": "Minimum latitude is invalid",
                "statusCode": 400
            })
        }
    }

    if (maxLat) {
        maxLat = Number(maxLat)
        if (isNaN(maxLat)) {
            res.status(400).json({
                "message": "Maximum latitude is invalid",
                "statusCode": 400
            })
        }
    }

    if (minLng) {
        minLng = Number(minLng)
        if (isNaN(minLng)) {
            res.status(400).json({
                "message": "Minimum longitude is invalid",
                "statusCode": 400
            })
        }
    }

    if (maxLng) {
        maxLng = Number(maxLng)
        if (isNaN(maxLng)) {
            res.status(400).json({
                "message": "Maximum longitude is invalid",
                "statusCode": 400
            })
        }
    }

    if (minPrice) {
        minPrice = Number(minPrice)
        if (isNaN(minPrice) || minPrice < 0) {
            res.status(400).json({
                "message": "Minimum price must be greater than or equal to 0",
                "statusCode": 400
            })
        }
    }

    if (maxPrice) {
        maxPrice = Number(maxPrice)
        if (isNaN(maxPrice) || maxPrice < 0) {
            res.status(400).json({
                "message": "Maximum price must be greater than or equal to 0",
                "statusCode": 400
            })
        }
    }

    page = Number(page)
    size = Number(size);

    if (!page) page = 1
    if (!size) size = 20
    if (page > 10) page = 10;
    if (size > 20) size = 20;

    let pagination = {}
    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }
    const allSpots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        ...pagination
    })


    let spotsList = [];
    allSpots.forEach(element => {
        spotsList.push(element.toJSON())
    })
    
    spotsList.forEach(spot => {
        let spotCount = 0
        let starsSum = 0
        spot.Reviews.forEach(review => {
            starsSum += review.stars
            spotCount++
        })
        spot.avgRating = starsSum / spotCount
        delete spot.Reviews
    })

    spotsList.forEach(element => {
        element.SpotImages.forEach(element2 => {
            if (element2.preview) {
                element.previewImage = element2.url
            } else {
                element.previewImage = 'No Preview Image'
            }
            delete element.SpotImages
        })

    })
    const format = { Spots: spotsList, page, size }
    res.json(format)
}
);

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = req.params.spotId
    const allBookingsForSpot = await Booking.findAll({
        where: {
            spotId
        },
        include: {
            model: User
        }
    })
    if (!allBookingsForSpot.length) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    const jsonBookedSpot = []
    allBookingsForSpot.forEach(element => {
        jsonBookedSpot.push(element.toJSON())
    })

    jsonBookedSpot.forEach(element => {
        delete element.User.username
    })

    const format = { Bookings: jsonBookedSpot }

    res.json(format)


})

//CREATE A BOOKING FROM SPOT ID
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = +req.params.spotId
    const userId = req.user.id
    const { startDate, endDate } = req.body
    const dataArray = [startDate, endDate]
    dataArray.forEach(element => {
        if (!element) {
            res.status(403).json({
                "message": 'start and end date need to be filled',
                "statusCode": 403
            })
        }
    })

    const specificSpot = await Spot.findByPk(spotId)

    if (!specificSpot) {
        res.status(404).json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
    }
    if (endDate <= startDate) {
        res.status(400);
        return res.status(400).json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": [
                "endDate cannot be on or before startDate"
            ]
        })
    }

    const specificSpotBookings = await Booking.findAll({
        where: {
            spotId
        }
    })

    for (let booking of specificSpotBookings) {
        booking = JSON.parse(JSON.stringify(booking))

        if (startDate == booking.startDate || endDate == booking.endDate) {
            res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            })
        }
        if (startDate < booking.endDate && startDate > booking.startDate) {
            res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            })
        }
        if (endDate < booking.endDate && endDate > booking.startDate) {
            res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            })
        }
    }

    const createNewBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate
    })
    res.json(createNewBooking)

})




//CREATE IMAGE FOR SPOT
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spotId = req.params.spotId
    const { url, preview } = req.body
    const spot = await Spot.findAll({
        where: {
            id: spotId
        }
    })
    if (!spot.length) {
        res.status(404).json(
            {
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
    }


    const newimage = await SpotImage.create({
        spotId: spotId,
        url,
        preview
    });

    const format = {
        id: newimage.id,
        url: newimage.url,
        preview: newimage.preview
    }

    res.json(format)
})




//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const currentUser = req.user.id
    const currentSpot = req.params.spotId
    const { review, stars } = req.body
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
    if (!spot.length) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    for (let review of something) {
        if (review.userId === currentUser) {
            res.status(403).json({
                "message": "User already has a review for this spot",
                "statusCode": 403
            })
        }
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

    const createdreview = await Review.create({ userId: req.user.id, spotId: currentSpot, review, stars })
    res.json(createdreview)
})




//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const inputSpot = req.params.spotId
    const specificspot = await Spot.findOne({
        where: {
            id: inputSpot
        }
    })
    if (specificspot) {
        await specificspot.destroy()
        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }



    if (!specificspot) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }


    res.json(specificspot)

})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
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
    if (!spotReview.length) {
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
        usr.ReviewImages.forEach(ele => {
            delete ele.createdAt
            delete ele.updatedAt
            delete ele.reviewId


        })
    })
    const format = { Reviews: spotlist }


    res.json(format)
})




//Edit a Spot
router.put('/:spotId', requireAuth, async (req, res) => {
    const currentUserId = req.params.spotId
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const specificSpot = await Spot.findByPk(currentUserId)
    const dataArray = [address, city, state, country, lat, lng, name, description, price]
    dataArray.forEach(element => {
        if (!element) {
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

    if (specificSpot) {
        specificSpot.set({ address, city, state, country, lat, lng, name, description, price })
        specificSpot.save();
        res.json(specificSpot)

    } else {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statuscode: 404
        })
    }
})

//Create a Spot
router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const spot = await Spot.create({ ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price })
    res.json(spot)

})


//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const currentUserId = req.user.id
    const currentUserSpot = await Spot.findAll({
        where: {
            ownerId: currentUserId
        }, include: [
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
            if (element.stars) {
                starsReview.push(element.stars)
            } delete spots.Reviews
            if (!element.stars) {
                spots.avgRating = 'No Ratings Yet'
            }
            let totalStars = starsReview.reduce((a, b) => a + b)
            spots.avgRating = totalStars / starsReview.length
        })
    })

    // preview image
    spotsList.forEach(spots => {
        spots.SpotImages.forEach(element => {
            // console.log(element.preview)
            if (element.preview === true) {
                // console.log(element)
                spots.previewImage = element.url
            } delete spots.Reviews
        })
        if (!spots.previewImage) {
            spots.previewImage = 'no preview image found'
        }
        delete spots.SpotImages
    })
    const format = {}
    format.Spots = spotsList
    res.json(format)
})


router.get('/:spotId', async (req, res) => {
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
    if (!specificSpot) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })

    }
    const specficSpotlist = specificSpot.toJSON()



    // avgStarRating
    let starsReview = []
    specficSpotlist.Reviews.forEach(element => {
        if (element.stars) {

            starsReview.push(element.stars)
        }
        let totalStars = starsReview.reduce((a, b) => a + b)
        specficSpotlist.avgStarRating = totalStars / starsReview.length
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



router.get('/', async (req, res) => {
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
            if (element.stars) {

                starsReview.push(element.stars)
            }
            let totalStars = starsReview.reduce((a, b) => a + b)
            spots.avgRating = totalStars / starsReview.length

        })

    })
    //preview image url when returning all spots
    spotlist.forEach(spots => {
        spots.SpotImages.forEach(element => {
            // console.log(element.preview)
            if (element.preview === true) {
                // console.log(element)
                spots.previewImage = element.url
            } delete spots.Reviews
        })
        if (!spots.previewImage) {
            spots.previewImage = 'no preview image found'
        }
        delete spots.SpotImages

    })

    res.json(spotlist)




})

router.delete('/:spotId', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const specficSpot = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    if (specficSpot.ownerId !== req.user.id) {
        const err = new Error('You are not the owner of this spot')
        err.status = 403
        throw err
    }

    if (!specficSpot) {
        const err = new Error("Review Image couldn't be found")
        err.status = 404
        throw err
    }

    await specficSpot.destroy()
    res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

router.get('/', async (req, res) => {

    //--------------------------------------
    let { page, size } = req.query;
    if (page < 1 || size < 1) {
        res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "page": "Page must be greater than or equal to 1",
                "size": "Size must be greater than or equal to 1",
                "maxLat": "Maximum latitude is invalid",
                "minLat": "Minimum latitude is invalid",
                "minLng": "Maximum longitude is invalid",
                "maxLng": "Minimum longitude is invalid",
                "minPrice": "Maximum price must be greater than or equal to 0",
                "maxPrice": "Minimum price must be greater than or equal to 0"
            }
        })
    }

    let pagination = {}
    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }
    //----------------------



    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ], ...pagination
    });

    let spotList = [];
    spots.forEach(spot => {
        spotList.push(spot.toJSON())
    });

    spotList.forEach(spot => {
        let sum = 0
        spot.Reviews.forEach(review => {
            sum += review.stars
        });
        spot.avgRating = sum / spot.Reviews.length
        delete spot.Reviews
    })

    spotList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = 'There are no images available for this location at this time.'
        }
        delete spot.SpotImages
    })
    // spotList.page = page
    // spotList.size = size

    const obj = {}
    obj.Spots = spotList

    obj.page = page
    obj.size = size

    res.json(obj)
});
module.exports = router
