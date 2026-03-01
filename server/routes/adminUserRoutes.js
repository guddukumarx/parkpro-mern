// routes/adminUserRoutes.js
import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
} from '../controllers/adminUserController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/toggle-status', toggleUserStatus);

export default router;