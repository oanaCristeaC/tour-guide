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
  getTourDistances,

  uploadTourImages,
  resizeTourImages,
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
  .get(protect, restrictTo('admin', 'lead-guide'), getMonthlyPlan);

// Get tours with given distance and unit
router
  .route('/tours-within/:distance/centre/:latlng/unit/:unit')
  .get(getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(getTourDistances);

router
  .route('/')
  .get(getTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
