// User endpoint
const express = require('express');
const router = express.Router();

const {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,

  checkId,
} = require('../controllers/userControllers');

router.param('id', checkId);

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

module.exports = router;
