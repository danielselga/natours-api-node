const express = require('express');
const reviewController = require('../controllers/reviewController');
const protectMiddleware = require('../middlewares/protectMiddleware');

const router = express.Router({ mergeParams: true });

router.use(protectMiddleware.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    protectMiddleware.restrictTo('user'),
    reviewController.setTourUsersIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    protectMiddleware.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    protectMiddleware.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
