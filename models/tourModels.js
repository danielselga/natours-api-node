const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name!'],
      unique: true,
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
    },
    ratingsAvg: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
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
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware: runs before .save() and .create() -> that means we can still work with the data after registered
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next()
// });

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
  tourSchema.pre(/^find/, function(next) { // Using regex to match with all the methods that start with 'find'
  this.find({secretTour: {$ne: true}})

  this.start = Date.now()
  next()
})

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`)
  console.log(docs);
  next()
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
