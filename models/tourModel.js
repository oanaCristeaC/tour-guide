const mongoose = require('mongoose');
const slugify = require('slugify');

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
    type: Number,
    required: [true, 'Tour must have a group size.']
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must have a difficulty.'],
    trim: true
  },
  rating: {
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
  this.endTime = Date.now()
  console.log(` Took ${this.startTime - this.endTime} ms`, docs)
  next();
})



// tourSchema.pre('save', function (next) {
//   console.log("Doc is saving...")
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log("Doc has been saved.", doc)
//   next();
// });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
