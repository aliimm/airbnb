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


router.put('/:spotId/bookings', requireAuth, async (req, res) => {
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



 router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId)
    const { startDate, endDate } = req.body
    const userId = req.user.id

    const startDateWithExtra = startDate + 'T00:00:00'
    const endDateFormatWithExtra = endDate + 'T03:00:00'
    console.log('eeeeeeeeeeeeeee', startDateWithExtra)
    console.log( 'eeeeeeeeeeeeeee',endDateFormatWithExtra)

    // puts date string into date format
    const startDateFormat = new Date(startDate)
    const endDateFormat = new Date(endDate)


    // below gets milliseconds from 1970 to date
    const timeToStart = startDateFormat.getTime()
    const timeToEnd = endDateFormat.getTime()

    // body validations to make sure end date is after start date
    if (timeToEnd <= timeToStart) {
        res.statusCode = 400
        return res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    }
    // finding all bookings for spot
    const bookingsForSpot = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        }
    })


    // if spot exists
    if (spot) {
        // if user isn't owner
        if (userId !== spot.ownerId) {
            // if bookings exist for the spot
            if (bookingsForSpot) {
                // check to see if the requested days conflict with an existing booking
                for (let booking of bookingsForSpot) {
                    // console.log({ 'booking': booking })
                    // below gets milliseconds from 1970 to start and end dates in booking for that spot
                    const realBookingStartDate = booking.startDate + 'T03:00:00'
                    const realBookingEndDate = booking.endDate + 'T03:00:00'
                    const bookedStartDate = new Date(realBookingStartDate)
                    const bookedEndDate = new Date(realBookingEndDate)
                    const timeToBookingStart = bookedStartDate.getTime()
                    const timeToBookingEnd = bookedEndDate.getTime()
                    // console.log({'start': timeToBookingStart})
                    // console.log({'end': timeToBookingEnd})

                    // if the asked booking start date is equal to an already booked start date or between the days of an existing booking
                    if (timeToStart === timeToBookingStart || (timeToStart > timeToBookingStart && timeToStart < timeToBookingEnd)) {
                        res.statusCode = 403;
                        return res.json({
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                "startDate": "Start date conflicts with an existing booking",
                            }
                        })
                    }
                    // if the asked booking end date is between the days of an existing booking
                    if (timeToEnd > timeToBookingStart && timeToEnd <= timeToBookingEnd) {
                        res.statusCode = 403;
                        return res.json({
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                "endDate": "End date conflicts with an existing booking"
                            }
                        })
                    }
                    // if the booking fully encompasses days of an existing booking
                    if (timeToStart < timeToBookingStart && timeToEnd > timeToBookingEnd) {
                        res.statusCode = 403;
                        return res.json({
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                "startDate": "Start date conflicts with an existing booking",
                                "endDate": "End date conflicts with an existing booking"
                            }
                        })
                    }
                }
                // if it makes it past all checks for each booking on that spot already
                const newBooking = await Booking.create({
                    spotId: Number(req.params.spotId),
                    userId,
                    startDate,
                    endDate
                })
                res.json(newBooking)
            } else {
                // if no bookings, create the booking
                const newBooking = await Booking.create({
                    spotId: Number(req.params.spotId),
                    userId,
                    startDate,
                    endDate
                })
                res.json(newBooking)
            }
        } else {
            res.statusCode = 400;
            res.json("Can't book at your own Spot!")
        }
    } else {
        res.statusCode = 404;
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
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
