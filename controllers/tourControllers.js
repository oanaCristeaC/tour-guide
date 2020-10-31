const Tour = require('../models/tourModel');
const API = require('../utils/api');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.getTours = catchAsync(async (req, res) => {
  const api = new API(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(); // Remove find()?
  const tours = await api.query;

  res.status(200).json({
    status: 'Success',
    requests: tours.length,
    data: {
      tours,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(200).json({
    status: 'Success',
    data: {
      newTour,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError(`No tour exists with ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(`No tour exists with ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'Updated',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError(`No tour exists with ${req.params.id}`, 404));
  }

  res.status(204).json({
    status: 'Deleted',
    data: {
      tour: null,
    },
  });
});

exports.getMothlyPlan = catchAsync(async (req, res) => {
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
        // busiest month firts
        numTours: -1,
      },
    },
    {
      $limit: 12, // unneccesary here yet
    },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      plan,
    },
  });
});
