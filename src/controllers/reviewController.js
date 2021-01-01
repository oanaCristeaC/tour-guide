import Review from '../models/reviewModel.js';
import factory from './handlerFactory.js';

export const deleteReview = factory.deleteOne(Review);
export const updateReview = factory.updateOne(Review);
export const getReview = factory.getOne(Review);
export const createReview = factory.createOne(Review);
export const getReviews = factory.getAll(Review);

export const setTourIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
