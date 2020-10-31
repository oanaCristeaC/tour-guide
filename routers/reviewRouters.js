const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, restrictTo } = require('../controllers/authController');
const {
  getReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview,
} = require('../controllers/reviewController');

// Routers '/' or '/:tourId/reviews' will be reroute to '/' due to mergeParams
router
  .route('/')
  .get(protect, getReviews)
  .post(protect, restrictTo('user'), createReview);
router
  .route('/:reviewId')
  .get(getReview)
  .delete(protect, deleteReview)
  .patch(protect, updateReview);

module.exports = router;
