const express = require('express');
const router = express.Router(); // Router class from express used to organize the routes middlewares
const tourController = require('../controllers/tourController');
const protectMiddleware = require('../middlewares/protectMiddleware');

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
  .use(protectMiddleware.protect)
  .route('/')
  .get(tourController.getAlltours)
  .post(tourController.createTour);

router
  .use(protectMiddleware.protect)
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
