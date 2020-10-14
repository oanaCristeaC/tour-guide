const express = require('express');
const router = express.Router();

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

router.route('/').get(getTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
