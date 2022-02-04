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
  
  // 3) Check if user still exists
  
  const currentUser = await User.findById(decoded.id)

  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist!', 401))
  }
  
  // 4) Check if user changed password after the jwt was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recently change password, Please login again!'))
  }

  // GRANT ACCESS TO PROTECTED NAME
  req.user = currentUser // Req able us to pass data from middle wares
  next();
}); 

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Role is an array ['admin', 'lead-guide']
    if (!roles.includes(req.user.roles)) {
      return next(new AppError('You do not have permition to perform this action', 403))
    }

    next()
  }
}
