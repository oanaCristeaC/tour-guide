const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');

exports.getReviews = catchAsync(async (req, res, next) => {
  // Take advantage of '/:tourId/reviews' which will end-up here '/'

  const tour = req.params.tourId ? { tour: req.params.tourId } : {}; // one tour or all
  console.log('tour', tour, req.params.tourId);

  const reviews = await Review.find(tour);
  res.status(200).json({
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const user = req.user._id ? req.user._id : req.body.user;
  const tour = req.params.tourId ? req.params.tourId : req.body.tour;

  const { review, rating } = req.body; // sterilization
  const newReview = await Review.create({ review, rating, user, tour });
  res.status(201).json({
    data: {
      newReview,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const id = req.params.reviewId;
  const review = await Review.findById(id);
  if (!review)
    return next(new AppError(`The review with ${id} could not be fount.`, 400));

  res.status(200).json({
    data: {
      review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const id = req.params.reviewId;
  const review = await Review.findByIdAndDelete(id);
  if (!review)
    return next(new AppError(`The review with ${id} could not be fount.`, 400));

  res.status(204).json({
    data: null,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const id = req.params.reviewId;
  if (!id)
    return next(new AppError(`The review with ${id} could not be fount.`, 400));

  const { review, rating, tour } = req.body; // sterilization
  const updatedReview = await Review.findByIdAndUpdate(
    id,
    { review, rating, tour },
    { new: true }
  );

  res.status(201).json({
    data: {
      updatedReview,
    },
  });
});
