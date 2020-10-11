const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Tour must have a name.'],
      unique: true,
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration.']
    },
    maxGroupSize: {
      type:Number,
      required: [true, 'Tour must have a group size.']
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty.'],
      trim: true
    },
    ratting: {
      type: Number,
      default: 0
    },
    ratingsAverage: {
      type: Number,
      default: 0
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price.']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true // Removes blanc spaces
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image.']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    
  });
  
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour