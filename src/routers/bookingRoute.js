const express = require('express');
const router = express.Router();
const {
  getCheckoutSession,
  createBooking,
  deleteBooking,
  getBooking,
  getBookings,
  updateBooking,
} = require('../controllers/bookingControllers');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/checkout-session/:tourId', protect, getCheckoutSession);

//TODO: TEST THIS.
// Use only by tour guides and admins
router.use(restrictTo('admin', 'lead-guide'));
router.route('/').get(protect, getBookings).post(protect, createBooking);
router
  .route('/:id')
  .get(protect, getBooking)
  .delete(protect, deleteBooking)
  .put(protect, updateBooking);

module.exports = router;
