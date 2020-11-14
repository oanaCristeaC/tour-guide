const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRouters');

const {
  getTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,

  aliasTopTours,
  tourStats,
  getMonthlyPlan,
  getToursWithin,
} = require('./../controllers/tourControllers');

/**
 *
 * Reroute to review whenever this route is met
 *
 */
router.use('/:tourId/reviews', reviewRouter);

// Extra tour with a middleware
router.route('/top-5-cheap').get(aliasTopTours, getTours);
router.route('/stats').get(tourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'tour-lead'), getMonthlyPlan);

router
  .route('/')
  .get(getTours)
  .post(protect, restrictTo('admin', 'tour-lead'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'tour-lead'), updateTour)
  .delete(protect, restrictTo('admin', 'tour-lead'), deleteTour);

// Get tours with given distance and unit
router
  .route('/tours-within/:distance/centre/:latlng/unit/:unit')
  .get(getToursWithin);

module.exports = router;
