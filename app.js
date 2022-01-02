const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRoutes = require('./routes/tourRoutes');

const app = express();

app.use(express.json());

// Third party middleware
app.use(morgan('dev'));

app.use((req, res, next) => {
  // Will apply to all req
  console.log('Hello from the middleware');
  next(); // Next needed to be caled in the end of the midleware
});

app.use((req, res, next) => {
  // Will apply to all req
  req.requestTime = new Date().toISOString();
  next(); // Next needed to be caled in the end of the midleware
});

// Using the routers
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRouter);

// Opening the server
const port = 3000;
app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});
