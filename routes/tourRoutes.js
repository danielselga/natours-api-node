const express = require('express');
const router = express.Router(); // Router class from express used to organize the routes middlewares
const tourController = require('../controllers/tourController');

router.param('id', (req,res, next, val) => { // Params middlewares recives a val param that able us to read the value passed in the param of the route.
    console.log(val, 'value')
    next()
})

router
  .route('/')
  .get(tourController.getAlltours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour);

module.exports = router;
