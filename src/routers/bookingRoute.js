import express from 'express';
const router = express.Router();
import {
  getCheckoutSession,
  createBooking,
  deleteBooking,
  getBooking,
  getBookings,
  updateBooking,
} from '../controllers/bookingControllers.js';
import { protect, restrictTo } from '../controllers/authController.js';

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

export default router;
