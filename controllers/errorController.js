const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `duplicate field value: ${value}, please try another`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((x) => x.message);

  const message = `invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    stauts: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  //operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      stauts: err.status,
      message: err.message,
    });
  }
  //programming or other unknown error: don't leak details to the client
  else {
    //Log error
    console.error('Error ', err);
    //send message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    sendProdError(error, res);
  }
};
