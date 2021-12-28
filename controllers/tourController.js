/* eslint-disable prefer-object-spread */
/* eslint-disable no-shadow */
const Tour = require('../models/tourModel');

exports.validateReqBody = (req, res, next) => {
  if (!req.body || !req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'failed',
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    // results: tours.length,
    // data: { tours },
  });
};

exports.getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = null;
  if (tour) {
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } else {
    res.status(404).json({
      status: 'not found',
    });
  }
};

exports.postTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: { tour: {} },
  });
};

exports.patchTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
  });
};
