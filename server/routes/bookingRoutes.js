// routes/bookingRoutes.js
import express from 'express';
import {
  createBooking,
  getMyBookings,
  getUserBookings,
  getBookingById,
  cancelBooking,
  refundBooking,
  extendBooking,
  getAllBookings,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User's own bookings
router.get('/my-bookings', getMyBookings);
router.post('/', createBooking);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);
router.patch('/:id/extend', extendBooking);

// Admin only routes
router.get('/', authorize('admin'), getAllBookings);
router.get('/user/:userId', authorize('admin'), getUserBookings);
router.post('/:id/refund', authorize('admin'), refundBooking);

export default router;