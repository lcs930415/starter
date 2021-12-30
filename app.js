const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static('./public'));

app.use((req, res, next) => {
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  const err = new Error('Cannot find the requested url');
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

//central error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    stauts: err.status,
    message: err.message,
  });
});

module.exports = app;
