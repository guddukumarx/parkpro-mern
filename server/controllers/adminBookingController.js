import Booking from '../models/Booking.js';
import { createAuditLog } from '../services/auditService.js';

/**
 * Update payment status of a booking (admin only)
 * @route PATCH /api/admin/bookings/:id/payment-status
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    // Validate status
    const validStatuses = ['paid', 'pending', 'failed', 'refunded', 'partially_refunded', 'disputed', 'cancelled', 'processing', 'on_hold'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Store previous status for audit
    const oldStatus = booking.paymentStatus;

    // Update status
    booking.paymentStatus = status;

    // Add to payment history if field exists
    if (booking.paymentHistory) {
      booking.paymentHistory.push({
        status,
        timestamp: new Date(),
        reason: reason || `Status changed by admin from ${oldStatus} to ${status}`,
        changedBy: req.user._id,
      });
    }

    await booking.save();

    // Audit log
    await createAuditLog({
      user: req.user._id,
      action: 'UPDATE',
      entity: 'Booking',
      entityId: booking._id,
      changes: { old: { paymentStatus: oldStatus }, new: { paymentStatus: status } },
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Payment status updated from ${oldStatus} to ${status}${reason ? ': ' + reason : ''}`,
    });

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};