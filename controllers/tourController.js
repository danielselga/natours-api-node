const fs = require('fs');
const Tour = require('../models/tourModels');

// JSON File
// exports.tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// ); //JSON.parse get a json and return a JS Object

exports.getAlltours = async (req, res) => {
  try {
    console.log(req.query)
    const tours = await Tour.find({
      duration: 5,
      difficulty: 'easy'
    })
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tours,
      },
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    // Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err
    })
  }
  // const tour = this.tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  // data: {
  //     tour,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid Data Send!'
    }) 
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    res.status(200).json({
      status: 'updated',
      data: {
        tour: updatedTour,
      },
    });

  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid Data Send!'
    }) 
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid Data Send!'
    }) 
  }
};

module.exports;
