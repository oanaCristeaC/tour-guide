const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image'))
    cb(new AppError('Please use only images.', 400));
  cb(null, true);
};

const upload = multer({ storage, fileFilter });
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // console.log('files', req.files);

  // Cover image
  if (req.files.imageCover) {
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);
  }

  // Tour images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const image = `tour-${req.params.id}-${Date.now()}-cover${i + 1}.jpg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${image}`);

        req.body.images.push(image);
      })
    );
  }
  next();
});

exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' }); // select doesn't work
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

// '/tours-within/:distance/centre/:latlng/unit/:unit'
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng)
    return next(
      new AppError('Please specify lat, lng on the right format', 400)
    );

  const radius = unit === 'km' ? distance / 6378.1 : distance / 3963.2;

  //https://docs.mongodb.com/manual/tutorial/calculate-distances-using-spherical-geometry-with-2d-geospatial-indexes/
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  if (!tours)
    return next(
      new AppError('Please specify lat, lng on the right format', 400)
    );

  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: tours,
  });
});

exports.getTourDistances = catchAsync(async (req, res, next) => {
  //'/distances/:latlng/unit/:unit'
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371192 : 0.001;

  if (!lat || !lng)
    return next(
      new AppError('Please specify lat, lng on the right format', 400)
    );

  //https://docs.mongodb.com/manual/reference/operator/aggregation/geoNear/#pipeline-geonear-key-param-example
  const tours = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng * 1, lat * 1] }, // convert to no
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    { $project: { name: true, distance: true } },
  ]);

  res.status(200).json({
    status: 'Success',
    data: tours,
  });
});
