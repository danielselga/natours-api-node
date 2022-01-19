const fs = require('fs');
const Tour = require('../models/tourModels');

// JSON File
// exports.tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// ); //JSON.parse get a json and return a JS Object

exports.getAlltours = async (req, res) => {
  try {
    console.log(req.query);

    // Querying using object
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy'
    // })

    // Querying using methods (mongoose methods)
    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy'); // We can have lte(), lt()...

    // Bluild the query
    // 1A) Filtering
    const queryObj = { ...req.query }; // Creating a NEW object copy of an object (not referenced)
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 2B) Avanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /(\bgte\b|\blt\b|\bgt\b|\blte\b)/g,
      (match) => `$${match}`
    );

    // {difficulty: 'easy', duration: {$gte: 5}}
    // {difficulty: 'easy', duration: {gte: 5}}
    // gte, gt, lte, lt

    let query = Tour.find(JSON.parse(queryStr));

    // console.log(req.query.sort , 'req')

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      // Sort('price ratingAverage') // To add a second or criteria add in the same string separated by space the critereas.
    } else {
      query = query.sort('-createdAt'); // Sorting by newest frist *nuts
    }

    // 3) Field limiting (Send only request data)
    if (req.query.fields) {
      console.log(req.query.fields)
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields); // Includes this fields to the response
    } else {
      query = query.select('-__v'); // Exclude this fields to the response
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1 // Convert str to num
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit
    // page=2&limit=10, 1-10, page 1, 11-20, page 2, 21-30 page 3
    query.skip(skip).limit(limit)

    if (req.query.page) { // Checking if the size of documents ir bigger then the skip
      const numTours = await Tour.countDocuments(page)
      if (skip > numTours) {
        throw new Error('This page does not exist')
      }
    }

    // Execute the query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: req.requestTime,
      data: {
        tours,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
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
      message: 'Invalid Data Send!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: 'updated',
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid Data Send!',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid Data Send!',
    });
  }
};

module.exports;
