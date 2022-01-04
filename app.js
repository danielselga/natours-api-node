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

module.exports = app
