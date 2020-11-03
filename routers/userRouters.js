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
} = require('../controllers/authController');

const {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,

  updateMe,
  deleteMe,

  checkId,
} = require('../controllers/userControllers');

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);

router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:tempToken').patch(resetPassword);
router.route('/update-password').patch(protect, updatePassword);
router.route('/update-me').patch(protect, updateMe);
router.route('/delete-me').delete(protect, deleteMe);

// To be ignored for now
router.param('id', checkId);

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

module.exports = router;
