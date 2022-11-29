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

    const specficImg = await ReviewImage.findOne({
        where: {
          id: imageId
        }
      })

      if(!specficImg){
         res.status(404).json({
          "message": "Review Image couldn't be found",
          "statusCode": 404
        })
      }

  await specficImg.destroy()
     res.status(200).json({
      "message": "Successfully deleted",
      "statusCode": 200
    })


})

module.exports = router;
