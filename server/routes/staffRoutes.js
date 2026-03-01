import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getStaffDashboard,
  getParkingSlots,
  updateSlotStatus,
} from '../controllers/staffAuthController.js';

const router = express.Router();

router.use(protect, authorize('staff'));

router.get('/dashboard', getStaffDashboard);
router.get('/parkings/:parkingId/slots', getParkingSlots);
router.patch('/slots/:slotId/status', updateSlotStatus);

export default router;