const mongoose = require('mongoose');
const Tour = require('./tourModel');

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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must be on a tour.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' }).populate({
    //TODO: get rid of the guides and tour durationWeeks
    path: 'tour',
    select: 'name',
  });
  next();
});

// use static method so we can call aggregate on it.
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0] ? stats[0].avgRating : 0,
    ratingsQuantity: stats[0] ? stats[0].nRating : 0,
  });
};

// Allow only one review for a user
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

// only after saving calculate the rating avg
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour); // access the model
});

// get and store the doc before being deleted
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  if (!this.r) return;
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  this.r.constructor.calcAverageRatings(this.r.tour._id);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
