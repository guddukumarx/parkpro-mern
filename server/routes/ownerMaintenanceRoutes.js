// routes/ownerMaintenanceRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createMaintenanceRequest,
  getOwnerMaintenanceRequests,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
} from '../controllers/maintenanceController.js';

const router = express.Router();

// All routes require authentication and owner role
router.use(protect, authorize('owner'));

router.post('/', createMaintenanceRequest);
router.get('/', getOwnerMaintenanceRequests);
router.patch('/:id', updateMaintenanceRequest);
router.delete('/:id', deleteMaintenanceRequest);

export default router;