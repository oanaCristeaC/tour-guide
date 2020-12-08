const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.getReviews = factory.getAll(Review);

exports.setTourIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
