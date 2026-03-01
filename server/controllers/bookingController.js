// controllers/bookingController.js
import Booking from "../models/Booking.js";
import Parking from "../models/Parking.js";
import Slot from "../models/Slot.js";
import User from "../models/User.js";
import {
  sendBookingConfirmationEmail,
  sendBookingCancelledEmail,
} from "../services/emailService.js";
import { createAuditLog } from "../services/auditService.js";

// Helper to add payment history entry
const addPaymentHistory = (booking, status, reason, changedBy, amount) => {
  if (!booking.paymentHistory) booking.paymentHistory = [];
  booking.paymentHistory.push({
    status,
    timestamp: new Date(),
    reason,
    changedBy,
    amount,
  });
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (user)
export const createBooking = async (req, res) => {
  try {
    const { parkingId, slotId, startTime, endTime, vehicleNumber, notes } =
      req.body;

    if (!parkingId || !slotId || !startTime || !endTime) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const parking = await Parking.findById(parkingId);
    if (!parking || parking.status !== "active") {
      return res
        .status(404)
        .json({ success: false, message: "Parking not available" });
    }

    const slot = await Slot.findOne({ _id: slotId, parking: parkingId });
    if (!slot) {
      return res
        .status(404)
        .json({ success: false, message: "Slot not found in this parking" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      return res
        .status(400)
        .json({ success: false, message: "End time must be after start time" });
    }

    const overlapping = await Booking.findOne({
      slot: slotId,
      status: { $in: ["confirmed", "active"] },
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });

    if (overlapping) {
      return res.status(409).json({
        success: false,
        message: "Slot not available for selected time",
      });
    }

    const hours = (end - start) / (1000 * 60 * 60);
    const totalPrice = hours * (slot.pricePerHour || parking.pricePerHour || 0);

    const booking = await Booking.create({
      user: req.user._id,
      parking: parkingId,
      slot: slotId,
      startTime: start,
      endTime: end,
      totalPrice,
      vehicleNumber,
      notes,
      status: "confirmed",
      paymentStatus: "pending",
      paymentHistory: [
        {
          status: "pending",
          timestamp: new Date(),
          reason: "Booking created",
          changedBy: req.user._id,
        },
      ],
    });

    // Send confirmation email (non‑blocking)
    try {
      const populatedBooking = await Booking.findById(booking._id)
        .populate("user")
        .populate("parking")
        .populate("slot");
      await sendBookingConfirmationEmail(
        populatedBooking,
        populatedBooking.user,
      );
    } catch (emailErr) {
      console.error("Confirmation email failed:", emailErr);
    }

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private (user)
export const getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    if (status) query.status = status;

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: "parking", select: "name address city images" },
        { path: "slot", select: "slotNumber type pricePerHour" },
      ],
    };

    const bookings = await Booking.find(query, null, options);
    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings for a specific user (admin only)
// @route   GET /api/bookings/user/:userId
// @access  Private (admin)
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: userId };
    if (status) query.status = status;

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: "parking", select: "name address city" },
        { path: "slot", select: "slotNumber type" },
        { path: "user", select: "name email" },
      ],
    };

    const bookings = await Booking.find(query, null, options);
    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings for the logged-in owner (bookings on their parkings)
// @route   GET /api/owner/bookings
// @access  Private (owner)
export const getOwnerBookings = async (req, res) => {
  try {
    // Find all parkings owned by this owner
    const parkings = await Parking.find({ owner: req.user._id }).select("_id");
    const parkingIds = parkings.map((p) => p._id);

    if (parkingIds.length === 0) {
      return res.json({
        success: true,
        data: [],
        pagination: { total: 0, page: 1, pages: 1 },
      });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const query = { parking: { $in: parkingIds } };
    if (status) query.status = status;

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: "user", select: "name email" },
        { path: "parking", select: "name address" },
        { path: "slot", select: "slotNumber" },
      ],
    };

    const bookings = await Booking.find(query, null, options);
    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private (user who owns it, owner of the parking, or admin)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("parking", "name address city images owner")
      .populate("slot", "slotNumber type pricePerHour");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Check authorization: user, owner of the parking, or admin
    const isUser = booking.user._id.toString() === req.user._id.toString();
    const isOwner =
      booking.parking.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isUser && !isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a booking (user, owner of parking, or admin)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (user who owns it, owner of parking, or admin)
export const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate("parking");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Authorization: user can cancel their own; owner can cancel bookings on their parking; admin any
    const isUser = booking.user.toString() === req.user._id.toString();
    const isOwner =
      booking.parking.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isUser && !isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Booking already cancelled" });
    }
    if (booking.status === "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel completed booking" });
    }

    booking.status = "cancelled";
    booking.cancelledBy = req.user._id;
    booking.cancellationReason = reason || "User requested cancellation";
    await booking.save();

    // Send cancellation email (non‑blocking)
    try {
      const populatedBooking = await Booking.findById(booking._id)
        .populate("user")
        .populate("parking")
        .populate("slot");
      await sendBookingCancelledEmail(populatedBooking, populatedBooking.user);
    } catch (emailErr) {
      console.error("Cancellation email failed:", emailErr);
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update payment status (admin only)
// @route   PATCH /api/admin/bookings/:id/payment-status
// @access  Private (admin)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const validStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded",
      "partially_refunded",
      "disputed",
      "cancelled",
      "processing",
      "on_hold",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment status" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const oldStatus = booking.paymentStatus;
    booking.paymentStatus = status;

    addPaymentHistory(
      booking,
      status,
      reason || `Status changed by admin from ${oldStatus} to ${status}`,
      req.user._id,
    );

    await booking.save();

    // Audit log
    await createAuditLog({
      user: req.user._id,
      action: "UPDATE",
      entity: "Booking",
      entityId: booking._id,
      changes: {
        old: { paymentStatus: oldStatus },
        new: { paymentStatus: status },
      },
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Payment status updated from ${oldStatus} to ${status}${reason ? ": " + reason : ""}`,
    });

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process a refund for a booking (admin only)
// @route   POST /api/admin/bookings/:id/refund
// @access  Private (admin)
export const refundBooking = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Booking payment not in paid state",
      });
    }

    // Validate amount
    const refundAmount = amount ? parseFloat(amount) : booking.totalPrice;
    if (refundAmount > booking.totalPrice) {
      return res
        .status(400)
        .json({ success: false, message: "Refund amount exceeds total price" });
    }

    // Determine new status
    let newStatus = "refunded";
    if (refundAmount < booking.totalPrice) {
      newStatus = "partially_refunded";
    }

    // Store refund details
    booking.refundAmount = (booking.refundAmount || 0) + refundAmount;
    booking.refundReason = reason || "Admin refund";
    booking.refundedAt = new Date();
    booking.paymentStatus = newStatus;

    addPaymentHistory(
      booking,
      newStatus,
      reason || `Refund of $${refundAmount.toFixed(2)} processed`,
      req.user._id,
      refundAmount,
    );

    await booking.save();

    // Audit log
    await createAuditLog({
      user: req.user._id,
      action: "REFUND",
      entity: "Booking",
      entityId: booking._id,
      changes: { amount: refundAmount },
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Refund of $${refundAmount.toFixed(2)} processed. Reason: ${reason || "N/A"}`,
    });

    res.json({ success: true, message: "Refund processed", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Extend an active booking (optional feature)
// @route   PATCH /api/bookings/:id/extend
// @access  Private (user or admin)
export const extendBooking = async (req, res) => {
  try {
    const { additionalMinutes } = req.body;
    const booking = await Booking.findById(req.params.id).populate("slot");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (!["confirmed", "active"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be extended in current state",
      });
    }

    let newEndTime;
    if (additionalMinutes) {
      newEndTime = new Date(
        booking.endTime.getTime() + additionalMinutes * 60000,
      );
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Additional minutes required" });
    }

    const overlapping = await Booking.findOne({
      slot: booking.slot._id,
      _id: { $ne: booking._id },
      status: { $in: ["confirmed", "active"] },
      startTime: { $lt: newEndTime },
      endTime: { $gt: booking.endTime },
    });

    if (overlapping) {
      return res
        .status(409)
        .json({ success: false, message: "Slot not available for extension" });
    }

    const additionalHours = (newEndTime - booking.endTime) / (1000 * 60 * 60);
    const additionalCost = additionalHours * (booking.slot.pricePerHour || 0);
    booking.endTime = newEndTime;
    booking.totalPrice += additionalCost;
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (admin only) with advanced filtering
// @route   GET /api/admin/bookings
// @access  Private (admin)
export const getAllBookings = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      paymentMethod,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort,
      populate: [
        { path: "user", select: "name email" },
        { path: "parking", select: "name address city" },
        { path: "slot", select: "slotNumber type" },
      ],
    };

    const bookings = await Booking.find(query, null, options);
    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
