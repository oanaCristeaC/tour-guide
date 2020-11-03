const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' }); // select doent work
exports.createTour = factory.createOne(Tour);
exports.getTours = factory.getAll(Tour);

exports.tourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'Success',
    requests: stats.length,
    data: {
      tours: stats,
    },
  });
});

// limit=5&sort=-ratingsAverage,price
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, ratingsAverage, price, summary';

  next();
};

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // break down based on dates
    },
    {
      $match: {
        //match only the ones within given year
        startDates: {
          $gt: new Date(`${year}-01-01`),
          $lt: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        //group them by month
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        names: { $push: '$name' },
      },
    },
    {
      $addFields: {
        // replace the _id key with month
        month: '$_id',
      },
    },
    {
      $project: { _id: 0 }, // hide _id field
    },
    {
      $sort: {
        // busiest month first
        numTours: -1,
      },
    },
    {
      $limit: 12, // unnecessary here yet
    },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      plan,
    },
  });
});
