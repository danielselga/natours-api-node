const express = require('express');
const router = express.Router(); // Router class from express used to organize the routes middlewares
const tourController = require('../controllers/tourController');

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAlltours)

router
  .route('/')
  .get(tourController.getAlltours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
