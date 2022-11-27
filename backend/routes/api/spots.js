const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage} = require('../../db/models');

const router = express.Router();

// backend/routes/api/users.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');
// ...

// const { requireAuth } = require('../../utils/auth');


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
