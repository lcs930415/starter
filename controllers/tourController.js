/* eslint-disable prefer-object-spread */
/* eslint-disable no-shadow */
const Tour = require('../models/tourModel');

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
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
