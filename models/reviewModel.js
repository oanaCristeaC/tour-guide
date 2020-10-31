const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      minlength: [2, 'A review mast have min 2 characters.'],
      maxlength: [200, 'A review can have max 200 characters.'],
      required: [true, 'Review is required.'],
    },
    rating: {
      type: Number,
      default: 1,
      min: [1, 'A tour must have a min rating value of 1.0'],
      max: [5, 'A tour must have a max rating value of 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        path: 'User',
        required: [true, 'Review must belong to a user.'],
      },
    ],
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        path: 'Tour',
        required: [true, 'Review must be on a tour.'],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'User', select: '-__v -passChanged' });
  this.populate({ path: 'Tour' });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
