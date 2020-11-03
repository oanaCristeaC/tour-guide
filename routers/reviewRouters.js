const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, restrictTo } = require('../controllers/authController');
const {
  getReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview,

  setTourIds,
} = require('../controllers/reviewController');

// Routers '/' or '/:id/reviews' will be reroute to '/' due to mergeParams
router
  .route('/')
  .get(protect, getReviews)
  .post(protect, restrictTo('user'), setTourIds, createReview);
router
  .route('/:id')
  .get(getReview)
  .delete(protect, protect, restrictTo('admin', 'user'), deleteReview)
  .patch(protect, protect, restrictTo('admin', 'user'), updateReview);

module.exports = router;
