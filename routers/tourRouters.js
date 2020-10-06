// tours endpoint
const express = require('express');
const router = express.Router();
const {
  getTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,

  verifyId,
  checkReq,
} = require('./../controllers/tourControllers');

// Checks
router.param('id', verifyId);

router.route('/').get(getTours).post(checkReq, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
