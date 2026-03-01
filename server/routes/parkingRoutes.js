// routes/parkingRoutes.js
import express from 'express';
import {
  getAllParkings,
  getParkingById,
  checkSlotAvailability,
} from '../controllers/parkingController.js';

const router = express.Router();

router.get('/', getAllParkings);
router.get('/:id', getParkingById);
router.get('/:id/slots/availability', checkSlotAvailability);

export default router;