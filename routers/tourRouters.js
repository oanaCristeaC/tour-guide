const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../controllers/authController')

const {
  getTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  tourStats,
  getMothlyPlan

} = require('./../controllers/tourControllers');

// Extra tour with a middleware 
router.route('/top-5-cheap').get(aliasTopTours, getTours);
router.route('/stats').get(tourStats);
router.route('/monthly-plan/:year').get(getMothlyPlan);

router.route('/').get(protect, getTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(protect, restrictTo('admin', 'tour-lead'), deleteTour);

module.exports = router;
