const express = require('express');
const router = express.Router();
const {getAccount} = require('../controllers/viewController')

const { getMyTours } = require('../controllers/viewController');
const { protect } = require('../controllers/authController');


router.get('/my-tours', protect, getMyTours);
router.get('/login', getAccount)

module.exports = router;
