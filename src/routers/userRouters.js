// User endpoint
import express from 'express';
const router = express.Router();

import {
  signUp,
  signIn,
  updatePassword,

  forgotPassword,
  resetPassword,

  protect,
  restrictTo,
} from '../controllers/authController.js';

import {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,

  updateMe,
  deleteMe,

  getUserId,
  resizeUserPhoto,
  uploadPhoto,
} from '../controllers/userControllers.js';

router.post('/signup', signUp);
router.post('/signin', signIn);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:tempToken', resetPassword);

// Protects all routes after this middleware
//router.use(protect) // Not used as just in case by mistake routes get rearranged

router.patch('/update-password', protect, updatePassword);
router.get('/me', protect, getUserId, getUser); // first set userId in params
router.patch('/update-me', protect, uploadPhoto, resizeUserPhoto, updateMe);
router.delete('/delete-me', protect, deleteMe);

//router.use(protect('admin'));

// To be used by admin only
//router.param('id', checkId);
router
  .route('/')
  .get(protect, restrictTo('admin'), getUsers)
  .post(protect, restrictTo('admin'), createUser);
router
  .route('/:id')
  .get(protect, restrictTo('admin'), getUser)
  .delete(protect, restrictTo('admin'), deleteUser)
  .patch(protect, restrictTo('admin'), updateUser);

export default router;
