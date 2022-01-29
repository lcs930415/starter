/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose');
const validator = require('validator');
const User=require('./userModel')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'input tour name is too long>40'],
      minlength: [10, 'input tour name is too short<10'],
      //validate: [validator.isAlpha, ' Tour name should only contain alphabets'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Atour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be above 1.0'],
      max: [5, 'rating must be below 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val <= this.price;
        },
        message: 'discount price should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour:{
      type:Boolean,
      default:false
    },
    startLocation:{
      //GeoJson
      type:{
        type:String,
        default:'Point',
        enum:['Point']
      },
      coordinates:[Number],
      address:String,
      description:String
    },
    locations:[
      {
        type:{
          type:String,
          default:'Point',
          enum:['Point'],
          coordinates:[Number],
          address:String,
          description:String,
          day:Number
        }
      }
    ],
    guides:Array
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Doc middleware runs before .save() command and .create() command
tourSchema.pre('save', function (next) {
  //"this" refers to the document being processed
  //console.log("first doc middleware");
  next();
});

tourSchema.pre('save', async function (next) {
  const guidesPromises=this.guides.map(async id=>await User.findById(id))
  this.guides=await Promise.all(guidesPromises);
  next();
});

tourSchema.post('save', function (doc, next) {
  //console.log("second middleware")
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
