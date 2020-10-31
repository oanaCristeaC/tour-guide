const mongoose = require('mongoose');
const slugify = require('slugify');
//const User = require('./userModel');
//const validate = require('mongoose-validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name.'],
      unique: true,
      trim: true,
      minlength: [5, `A tour name must have a min of 5 characters`],
      maxlength: [40, 'A tour name must have a max of 40 characters'],
      //validate: [validator.isAlpha, 'Name must have only letters'] // does not allow spaces
    },
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    rating: {
      type: Number,
      default: 1,
      min: [1, 'A tour must have a min rating value of 1.0'],
      max: [5, 'A tour must have a max rating value of 5.0'],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price.'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price must be lower than the price.',
      },
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true, // Removes blanc spaces
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    vip: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 *
 * Middleware which sets the slug field value to the tour name
 *
 */
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/**
 * Query middleware to hide the tours that are VIP
 */
tourSchema.pre(/^find/, function (next) {
  this.find({ vip: { $ne: true } });
  this.startTime = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // filter out all VIP tours be default
  console.log(` Took ${this.startTime - Date.now()} ms`);
  //console.log(docs)
  next();
});

/**
 *
 * Aggregation middleware to exclude the VIP tours from the statistics
 *
 */
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { vip: { $ne: true } } });
  next();
});

/**
 *
 * Middleware for populating the reference guide field.
 *
 */
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passChanged',
  });
  next();
});

// // Test get the embedded users guides
// tourSchema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(
//     async (guideId) => await User.findById(guideId)
//   );
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });

/**
 *
 * Middleware to transform on the fly the duration on weeks
 *
 */
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
