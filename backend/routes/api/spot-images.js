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



router.delete('/:imageId', requireAuth, async(req, res)=> {
    const imageId = req.params.imageId
    const specficImg = await SpotImage.findOne({
        where: {
          id: imageId
        }
      })
    if(!specficImg){
        res.status(404).json({
            "message": "Spot Image couldn't be found",
            "statusCode": 404
        })
    }

    const spot = await Spot.findOne({
        where: {
          id: specficImg.spotId
        }
      })

      if(req.user.id !== spot.ownerId){
        const err = new Error('You are not the owner of this image')
        err.status = 403
        throw err
      }

        await specficImg.destroy()
        return res.status(200).json({
          "message": "Successfully deleted",
          "statusCode": 200
        })


})



module.exports = router;
