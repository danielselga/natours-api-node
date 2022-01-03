const fs = require('fs');

// JSON File
exports.tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
); //JSON.parse get a json and return a JS Object

exports.getAlltours = (req, res) => {
  console.log(req.requestTime);
  const tours = this.tours
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: this.tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = this.tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = (this.tours[this.tours.length - 1].id = +1);
  const newTour = Object.assign({ id: newId }, req.body); //Object assing  permits to merge an existing object.

  this.tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(this.tours),
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

exports.patchTour = (req, res) => {

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

exports.deleteTour = (req, res) => {

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports