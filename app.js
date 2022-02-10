const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const userRouter = require('./routes/userRoutes');
const tourRoutes = require('./routes/tourRoutes');
const app = express();
const appError = require('./utils/appError');
const errorMidleware = require('./middlewares/errorMiddleware')

// Morgan only on with enviroment variable
if(process.env.NODE_ENV === 'development') {
  console.log('Morgan on')
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', limiter)

// Middlewares to Parsing the requisitions body
app.use(express.json()); // Extreme important to post and patch methods

app.use(express.static(`${__dirname}/public`))

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
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRouter);

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