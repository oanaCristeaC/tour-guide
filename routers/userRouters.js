// User endpoint
const express = require('express');
const router = express.Router();
const {
    getUsers,
    createUser,
    getUser,
    deleteUser,
    updateUser
} = require('../controllers/userControllers')

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser)


module.exports = router;