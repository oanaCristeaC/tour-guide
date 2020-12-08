const express = require('express');
const router = express.Router();

const { getMyTours } = require('../controllers/viewController');
const { protect } = require('../controllers/authController');

router.use('/my-tours', protect, getMyTours);

module.exports = router;
