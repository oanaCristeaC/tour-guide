// tours endpoint
const express = require('express');
const router = express.Router();
const {
    getTours,
    createTour,
    getTour,
    updateTour,
    deleteTour
} = require('./../controllers/tourControllers')

router.route('/').get(getTours).post(createTour);
router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router