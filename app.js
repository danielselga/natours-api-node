const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

app.use(express.json());

// Creating a middleware

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

// JSON File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
); //JSON.parse get a json and return a JS Object

// Callback functions
const getAlltours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params , 'req params');

  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = (tours[tours.length - 1].id = +1);
  const newTour = Object.assign({ id: newId }, req.body); //Object assing  permits to merge an existing object.

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const patchTour = (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

const deleteTour = (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

// Routes

// Tour Routes
const tourRoutes = express.Router() // Router class from express used to organize the routes middlewares

tourRoutes
.route('/')
.get(getAlltours)
.post(createTour);

tourRoutes
.route('/:id')
.get(getTour)
.patch(patchTour)
.delete(deleteTour);

// User routes
const userRouters = express.Router()

userRouters
.route('/')
.get(getAllUsers)
.post(createUser);

userRouters
.route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser);

// Using the routers
app.use('/api/v1/tours', tourRoutes)
app.use('/api/v1/users', userRouters)

// Opening the server
const port = 3000;
app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});
