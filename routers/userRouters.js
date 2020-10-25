// User endpoint
const express = require('express');
const router = express.Router();
const { signUp, signin, resetPassword, forgotPassword, updatePassword, protect } = require('../controllers/authController')

const {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,

  checkId,
} = require('../controllers/userControllers');

router.route('/signup').post(signUp);
router.route('/signin').post(signin);

router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:tempToken').patch(resetPassword);
router.route('/updatepassword').patch(protect, updatePassword)

// To be ignored for now
router.param('id', checkId);

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

module.exports = router;
