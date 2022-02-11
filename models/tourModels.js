const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name!'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A touor name must have less or equal than 40 characters.',
      ],
      minLenght: [
        10,
        'A touor name must have greater or equal than 10 characters.',
      ],
      // validate: [validator.isAlpha, 'Tour name must only contains characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAvg: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be above 1.0'],
      max: [5, 'Ratings must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // Custom validators, must be returned by true or false
      validate: {
        message: 'Discount price ({VALUE}) should be below the regular price.',
        validator: function (val) {
          // This only points to current doc on NEW documents creationg
          return val < this.price;
        },
      },
    },
    summary: {
      type: String,
      trim: true, // Remove all the white spaces in the beginning and the end
      require: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String], // Array of strings
    createdAt: {
      type: Date, // Adding date automaticaly
      default: Date.now(),
      select: false, // Dont send in any route
    },
    startDates: [Date], // Array of date
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: 'Point',
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// MONGOOSE MIDDLEWARES

// Document Middleware: runs before .save() and .create() -> that means we can still work with the data after registered

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async el => await User.findById(el))
//   this.guides = await Promise.all(guidesPromises) // Resolving the promise.
//   next()
// })

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...')
//   next()
// })

// tourSchema.post('save', function(doc, next) {
//   console.log(doc)
//   next()
// })

// PRE AND POST
// PRE MEANS BEFORE THE HOOK THAT WE WILL PASS AS FRIST PARAM AND POST MEANS AFTER THE HOOK.

// Query middleware
// tourSchema.pre('find', function(next) { // pre 'find' that means this middleware runs before the find method in the query
tourSchema.pre(/^find/, function (next) {
  // Using regex to match with all the methods that start with 'find'
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  })
  next()
})

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

   

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // Put an match to the agreggation pipeline
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
