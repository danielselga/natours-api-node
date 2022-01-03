const tourController = require('../controllers/tourController')

// Check id middleware
exports.checkID = (req, res, next, val) => {
  if (Number(req.params.id) > tourController.tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price'
    })
  }
  next()
}

module.exports;
