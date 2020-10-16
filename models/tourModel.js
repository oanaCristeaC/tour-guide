const mongoose = require('mongoose');
const slugify = require('slugify');
const validate = require('mongoose-validator');
const validator = require('validator');

const dificValidator = [
  validate({
    validator: 'matches',
    arguments: ['easy, medium or difficult'],
    message: 'Difficulty must be: {ARGS[0]}',
  })
]

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name.'],
    unique: true,
    trim: true,
    minlength: [5, `A tour name must have a min of 5 characters`],
    maxlength: [40, 'A tour name must have a max of 40 characters'],
    //validate: [validator.isAlpha, 'Nume must have only letters'] // does not allow spaces
  },
  duration: {
    type: Number,
    required: [true, 'Tour must have a duration.']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size.']
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must have a difficulty.'],
    trim: true,
    validate: dificValidator
    // enum: {
    //   values: ['easy', 'medium', 'difficult'],
    //   message: 'Available values for difficulty are: easy, medium or difficult'
    // }
  },
  rating: {
    type: Number,
    default: 0,
    min: [1, 'A tour must have a min ratting value of 1.0'],
    max: [5, 'A tour must have a max ratting value of 5.0'],
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
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price
      },
      message: 'Dicount price must be lower than the price.'
    }
  },
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
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  vip: {
    type: Boolean,
    default: false
  },
  slug: String
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Document middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next();
});

// Querry middleware
tourSchema.pre(/^find/, function (next) { // filter out all VIP tours be default
  this.find({ vip: { $ne: true } })
  this.startTime = Date.now()
  next();
});

tourSchema.post(/^find/, function (docs, next) { // filter out all VIP tours be default
  console.log(` Took ${this.startTime - Date.now()} ms`);
  //console.log(docs)
  next();
});

// Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { vip: { $ne: true } } });
  next();
})

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
