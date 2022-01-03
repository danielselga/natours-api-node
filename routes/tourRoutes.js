const express = require('express');
const router = express.Router(); // Router class from express used to organize the routes middlewares
const tourController = require('../controllers/tourController');
const tourMiddlewares = require('../middleware/tourMiddlewares')

// Router param middleware
router.param('id', tourMiddlewares.checkID)

router
  .route('/')
  .get(tourController.getAlltours)
  .post(tourMiddlewares.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour);

module.exports = router;
