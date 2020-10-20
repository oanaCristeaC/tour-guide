// User endpoint
const express = require('express');
const router = express.Router();

const {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,

  signUp,

  checkId,
} = require('../controllers/userControllers');

router.route('/signup').post(signUp)

// To be ingnored for now
router.param('id', checkId);

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

module.exports = router;
