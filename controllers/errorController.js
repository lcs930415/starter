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
    sendProdError(err, res);
  }
};
