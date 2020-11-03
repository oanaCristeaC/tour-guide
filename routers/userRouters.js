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
} = require('../controllers/userControllers');

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);

router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:tempToken').patch(resetPassword);

// Protects all routes after this middleware
//router.use(protect) // Not used as just in case by mistake routes get rearranged

router.route('/update-password').patch(protect, updatePassword);
router.route('/me').get(protect, getUserId, getUser); // first set userId in params
router.route('/update-me').patch(protect, updateMe);
router.route('/delete-me').delete(protect, deleteMe);

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
