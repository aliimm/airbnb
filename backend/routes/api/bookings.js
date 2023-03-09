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



router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    const getAllCurrentBookings = await Booking.findAll({
        where: {
            userId
        },
        include: {
            model: Spot,
            include: { model: SpotImage }
        }
    })

    const jsonCurrent = []
    getAllCurrentBookings.forEach(element => {
        jsonCurrent.push(element.toJSON())
    })

    jsonCurrent.forEach(element => {
        delete element.Spot.description
        delete element.Spot.createdAt
        delete element.Spot.updatedAt
        element.Spot.SpotImages.forEach(element2 => {
            if (element2.preview) {
                element.Spot.previewImage = element2.url
            } else {
                element.Spot.previewImage = "There are no images at this time"
            }
        })
        delete element.Spot.SpotImages
    })

    const booking = { Bookings: jsonCurrent }

    res.json(booking)


})


router.put('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = req.params.bookingId
    const { startDate, endDate } = req.body
    const specificBooking = await Booking.findByPk(bookingId)
    // const book = await Booking.findAll(specificBooking.id,
    //     where: {

    //     })
    // const spotId = book.spotId

    if (endDate < startDate) {
        res.status(400).json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot come before startDate"
            }
        })
    }

    if (!specificBooking) {
        res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
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

    specificBooking.set({ startDate, endDate })
    specificBooking.save()
    res.json(specificBooking)


})
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = req.params.bookingId;

    const specificBooking = await Booking.findOne({
        where: {
            id: bookingId
        }
    })

    if (!specificBooking) {
        res.status(404).json({
            "message": "Review Image couldn't be found",
            "statusCode": 404
        })
    }

    if(specificBooking.userId !== req.user.id){
        const err = new Error('You are not the owner of this spot')
        err.status = 403
        throw err
      }

        await specificBooking.destroy()
         res.status(200).json({
          "message": "Successfully deleted",
          "statusCode": 200
        })

})



module.exports = router;
