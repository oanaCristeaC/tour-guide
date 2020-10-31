const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../controllers/authController');
const { createReview, getReviews } = require('../controllers/reviewController');

const {
  getTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  tourStats,
  getMothlyPlan,
} = require('./../controllers/tourControllers');

// Extra tour with a middleware
router.route('/top-5-cheap').get(aliasTopTours, getTours);
router.route('/stats').get(tourStats);
router.route('/monthly-plan/:year').get(getMothlyPlan);

router.route('/').get(protect, getTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'tour-lead'), deleteTour);

// TODO: refactor
router
  .route('/:tourId/reviews')
  .get(getReviews)
  .post(protect, restrictTo('user'), createReview);

module.exports = router;
