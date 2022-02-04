const { promisify } = require('util');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log(token);

  if (!token) {
    return next(
      new AppError('You are not loged in!, please login to get access!', 401)
    );
  }

  // 2) Verify the token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  console.log(decoded)
  
  // 3) Check if user still exists
  
  const freshUser = await User.findById(decoded.id)
  
  // 4) Check if user changed password after the jwt was issued

  next();
}); 
