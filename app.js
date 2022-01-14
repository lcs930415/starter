const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//Global Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.static('./public'));

app.use((req, res, next) => {
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  next(new AppError('Cannot find the requested url', 404));
});

//central error handler
app.use(globalErrorHandler);

module.exports = app;
