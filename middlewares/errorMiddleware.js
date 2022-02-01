const AppError = require("../utils/appError");

const handleCastErrDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const message = `Duplicate field value: ${value}. Please use another value!`
  return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const SendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log Error
    console.log('Error', err);

    // 2) Send the generic message
    res.status(500).json({
      status: 'error',
      messege: 'Something went very wrong!',
    });
  }
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err}
    if(error.name === 'CastError') {
      return error = handleCastErrDB(error)
    }
    if (error.code === 11000) {
      return error = handleDuplicateFieldsDB(error)
    }
    SendErrorProd(error, res);
  }
};
