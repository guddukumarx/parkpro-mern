// routes/userRoutes.js
import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.post('/change-password', changePassword);
router.delete('/account', deleteAccount);

export default router;