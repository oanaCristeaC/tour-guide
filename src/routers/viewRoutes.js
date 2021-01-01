import express from 'express';
const router = express.Router();
import {getAccount, createAccount} from '../controllers/viewController.js';

import { getMyTours } from '../controllers/viewController.js';
import { protect } from '../controllers/authController.js';


router.get('/my-tours', protect, getMyTours);
router.get('/login', getAccount)
router.get('/register', createAccount)

export default router;
