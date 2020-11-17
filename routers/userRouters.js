// User endpoint
const express = require('express');
const router = express.Router();

const {
  signUp,
  signIn,
  updatePassword,

  forgotPassword,
  resetPassword,

  protect,
  restrictTo,
} = require('../controllers/authController');

const {
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
} = require('../controllers/userControllers');

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

//router.use(restrictTo('admin'));

// To be used by admin only
//router.param('id', checkId);
router
  .route('/')
  .get(restrictTo('admin'), getUsers)
  .post(restrictTo('admin'), createUser);
router
  .route('/:id')
  .get(restrictTo('admin'), getUser)
  .delete(restrictTo('admin'), deleteUser)
  .patch(restrictTo('admin'), updateUser);

module.exports = router;
