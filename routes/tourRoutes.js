const express = require('express');
const router = express.Router(); // Router class from express used to organize the routes middlewares
const tourController = require('../controllers/tourController');
const protectMiddleware = require('../middlewares/protectMiddleware');
const reviewRouter = require('../routes/reviewRoutes');

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// POST /tour/234fad4/reviews

// router
//   .route('/:tourId/reviews')
//   .post(protectMiddleware.restrictTo('user'), reviewController.createReview);

router
  .use(protectMiddleware.protect)
  .route('/tour-stats')
  .get(tourController.getTourStats);

router
  .use(protectMiddleware.protect)
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAlltours);

router
  .use(protectMiddleware.protect)
  .route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAlltours)
  .post(
    protectMiddleware.protect,
    protectMiddleware.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    protectMiddleware.protect,
    protectMiddleware.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    protectMiddleware.protect,
    protectMiddleware.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
