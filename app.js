const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRoutes = require('./routes/tourRoutes');
const app = express();

// Morgan only on with enviroment variable
if(process.env.NODE_ENV === 'development') {
  console.log('Morgan on')
  app.use(morgan('dev'));
}

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
  const err = new Error(`Can't find ${req.originalUrl} on this server`)
  err.status = 'fail'
  err.statusCode = 404

  next(err)
})

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

module.exports = app
