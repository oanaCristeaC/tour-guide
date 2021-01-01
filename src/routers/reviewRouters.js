import express from 'express';
const router = express.Router({ mergeParams: true });
import { protect, restrictTo } from '../controllers/authController.js';
import {
  getReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview,

  setTourIds,
} from'../controllers/reviewController.js';

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

export default router;
