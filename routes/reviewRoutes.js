const express = require('express');
const reviewController = require('../controllers/reviewController');
const protectMiddleware = require('../middlewares/protectMiddleware');

const router = express.Router();

router
  .route('/')
  .get(
    protectMiddleware.protect,
    reviewController.getAllReviews
  )
  .post(
    protectMiddleware.protect,
    reviewController.createReview
  );

module.exports = router;
