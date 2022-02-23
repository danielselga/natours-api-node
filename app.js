const path = require('path')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const userRouter = require('./routes/userRoutes');
const tourRoutes = require('./routes/tourRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

const appError = require('./utils/appError');
const errorMidleware = require('./middlewares/errorMiddleware')


// Morgan only on with enviroment variable, Development Log
if(process.env.NODE_ENV === 'development') {
  console.log('Morgan on')
  app.use(morgan('dev'));
}

// Set security http headers
app.use(helmet())

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', limiter)


// Middlewares to Parsing the requisitions body
app.use(express.json({limit: '10kb'})); // Extreme important to post and patch methods

// Data sanitization against NoSql query injection
app.use(mongoSanitize())

// Data sanitization agains XXS
app.use(xss())

// Prevent parametrer polution
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}))



// Test middleware
app.use((req, res, next) => {
  // Will apply to all req
  console.log('Hello from the middleware');
  next(); // Next needed to be caled in the end of the midleware
});

app.use((req, res, next) => {
  // Will apply to all req
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime)
  console.log(req.headers)
  next(); // Next needed to be caled in the end of the midleware
});

// Using the routers
app.use('/', viewRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRoutes)

// All the http methods (works because the last middleware check the routes and execute.)
app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl}`
  //   })
  // const err = new Error(`Can't find ${req.originalUrl} on this server`)
  // err.status = 'fail'
  // err.statusCode = 404
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(errorMidleware.globalErrorHandler)

module.exports = app