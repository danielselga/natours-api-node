const Tour = require('../models/tourModels');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../middlewares/errorMiddleware');

// JSON File
// exports.tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// ); //JSON.parse get a json and return a JS Object

exports.aliasTopTours = catchAsync((req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,sumary,difficulty';
});

exports.getAlltours = catchAsync(async (req, res, next) => {
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
  // const queryObj = { ...req.query }; // Creating a NEW object copy of an object (not referenced)
  // const excludeFields = ['page', 'sort', 'limit', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);

  // // 2B) Avanced filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(
  //   /(\bgte\b|\blt\b|\bgt\b|\blte\b)/g,
  //   (match) => `$${match}`
  // );

  // {difficulty: 'easy', duration: {$gte: 5}}
  // {difficulty: 'easy', duration: {gte: 5}}
  // gte, gt, lte, lt

  // let query = Tour.find(JSON.parse(queryStr));

  // console.log(req.query.sort , 'req')

  // 2) Sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  //   // Sort('price ratingAverage') // To add a second or criteria add in the same string separated by space the critereas.
  // } else {
  //   query = query.sort('-createdAt'); // Sorting by newest frist *nuts, if you put the minus in front will switch the order to desc
  // }

  // 3) Field limiting (Send only request data)
  // if (req.query.fields) {
  //   console.log(req.query.fields);
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields); // Includes this fields to the response
  // } else {
  //   query = query.select('-__v'); // Exclude this fields to the response
  // }

  // 4) Pagination
  // const page = req.query.page * 1 || 1; // Convert str to num
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;
  // // page=2&limit=10, 1-10, page 1, 11-20, page 2, 21-30 page 3
  // query.skip(skip).limit(limit);

  // if (req.query.page) {
  //   // Checking if the size of documents ir bigger then the skip
  //   const numTours = await Tour.countDocuments(page);
  //   if (skip > numTours) {
  //     throw new Error('This page does not exist');
  //   }
  // }

  // Execute the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  // query.sort().select().skip().limit()

  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
});

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: tour,
//   });
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAvg: { $gte: 4.5 } }, // Creating a matching
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // This _id is the separator if we need to send by category, in this case will return all the difficulty variants and group them.
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAvg' }, //  Calling one average in this matching
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: {$ne: 'EASY'} } // Matching multiple times, in this case we're excluding easy
    // }
  ]); // Agregation pipeline

  console.log(stats);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // Create one document for the qtd of element inside the array that was unwinded, passing the values inside the documents.
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`), // yy/mm/dd
          $lte: new Date(`${year}-12-31`), // The frist and the last date of the year
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // Grouping by month
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }, // Creates one array and send all the tours names inside
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12, // Limit the lenght of outputs
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lng'
      ),
      400
    );
  }

  console.log(distance, center, unit, lat, lng);

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lng'
      ),
      400
    );
  }

  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      data: distance
    }
  });
})