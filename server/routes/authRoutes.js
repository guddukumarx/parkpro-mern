// routes/authRoutes.js
import express from 'express';
import { register, login, logout, refreshToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);

export default router;