// controllers/payoutController.js
import Payout from "../models/Payout.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js"; // for balance calculation
import { createAuditLog } from "../services/auditService.js";

/**
 * Helper: Calculate owner's available balance from completed bookings
 * (adjust based on your business logic and earnings tracking)
 */
const getOwnerAvailableBalance = async (ownerId) => {
  try {
    // Find all parkings owned by this owner
    const Parking = (await import("../models/Parking.js")).default;
    const parkings = await Parking.find({ owner: ownerId }).select("_id");
    const parkingIds = parkings.map((p) => p._id);

    // Aggregate total earnings from confirmed/completed bookings (paid)
    const result = await Booking.aggregate([
      {
        $match: {
          parking: { $in: parkingIds },
          paymentStatus: "paid",
          status: { $in: ["confirmed", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
          totalEarned: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalEarned = result.length > 0 ? result[0].totalEarned : 0;

    // Subtract already requested payouts (pending or completed)
    const payouts = await Payout.aggregate([
      {
        $match: {
          owner: ownerId,
          status: { $in: ["pending", "processing", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRequested: { $sum: "$amount" },
        },
      },
    ]);
    const totalRequested = payouts.length > 0 ? payouts[0].totalRequested : 0;

    return totalEarned - totalRequested;
  } catch (error) {
    console.error("Balance calculation error:", error);
    return 0;
  }
};

// ======================================================
// OWNER: Request payout
// POST /api/owner/payouts
// ======================================================
export const requestPayout = async (req, res) => {
  try {
    let { amount, paymentMethod, accountDetails } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payout amount is required",
      });
    }

    // Map common payment method values to enum
    const paymentMethodMap = {
      bank: "bank_transfer",
      paypal: "paypal",
      stripe: "stripe",
      other: "other",
    };
    if (paymentMethodMap[paymentMethod]) {
      paymentMethod = paymentMethodMap[paymentMethod];
    }

    // If still not valid, default to 'bank_transfer' or return error
    const validMethods = ["bank_transfer", "paypal", "stripe", "other"];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Allowed: ${validMethods.join(", ")}`,
      });
    }

    // Optional: Check available balance
    const availableBalance = await getOwnerAvailableBalance(req.user._id);
    if (availableBalance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ₹${availableBalance.toFixed(2)}`,
      });
    }

    // Ensure accountDetails is an object (default to empty)
    accountDetails = accountDetails || {};

    // Create payout request
    const payout = await Payout.create({
      owner: req.user._id,
      amount,
      paymentMethod,
      accountDetails,
      status: "pending",
      requestedAt: new Date(),
    });

    // Audit log
    await createAuditLog({
      user: req.user._id,
      action: "CREATE",
      entity: "Payout",
      entityId: payout._id,
      changes: {
        amount,
        paymentMethod,
      },
      ip: req.clientIp || req.ip,
      userAgent: req.headers["user-agent"],
      details: `Payout requested: ₹${amount}`,
    });

    return res.status(201).json({
      success: true,
      message: "Payout request submitted successfully",
      data: payout,
    });
  } catch (error) {
    console.error("Request payout error:", error);

    // Handle duplicate key or validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to request payout",
    });
  }
};

// ======================================================
// OWNER: Get payout history
// GET /api/owner/payouts
// ======================================================
export const getOwnerPayouts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { owner: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const payouts = await Payout.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payout.countDocuments(query);

    return res.json({
      success: true,
      data: payouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get owner payouts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payouts",
    });
  }
};


// ======================================================
// OWNER: Cancel payout
// PUT /api/owner/payouts/:id/cancel
// ======================================================
export const cancelOwnerPayout = async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);

    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Payout not found",
      });
    }

    // Ensure payout belongs to owner
    if (payout.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this payout",
      });
    }

    // Only pending payouts can be cancelled
    if (payout.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending payouts can be cancelled",
      });
    }

    payout.status = "cancelled";
    payout.cancelledAt = new Date();

    await payout.save();

    // Audit log
    await createAuditLog({
      user: req.user._id,
      action: "UPDATE",
      entity: "Payout",
      entityId: payout._id,
      changes: { status: "cancelled" },
      ip: req.clientIp || req.ip,
      userAgent: req.headers["user-agent"],
      details: `Payout cancelled: ₹${payout.amount}`,
    });

    return res.json({
      success: true,
      message: "Payout cancelled successfully",
      data: payout,
    });

  } catch (error) {
    console.error("Cancel payout error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel payout",
    });
  }
};


// ======================================================
// ADMIN: Get all payouts
// GET /api/admin/payouts
// ======================================================
export const getAllPayouts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const payouts = await Payout.find(query)
      .populate("owner", "name email")
      .populate("processedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payout.countDocuments(query);

    return res.json({
      success: true,
      data: payouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all payouts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payouts",
    });
  }
};

// ======================================================
// ADMIN: Update payout status
// PATCH /api/admin/payouts/:id/status
// ======================================================
export const updatePayoutStatus = async (req, res) => {
  try {
    const { status, notes, transactionId } = req.body;

    const validStatuses = ["processing", "completed", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payout status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const payout = await Payout.findById(req.params.id);
    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Payout not found",
      });
    }

    // Optional: prevent changing already completed/rejected payouts
    if (payout.status === "completed" || payout.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Cannot change a payout that is already completed or rejected",
      });
    }

    payout.status = status;
    if (notes) payout.notes = notes;
    if (transactionId) payout.transactionId = transactionId;

    if (status === "completed" || status === "rejected") {
      payout.processedBy = req.user._id;
      payout.processedAt = new Date();
    }

    await payout.save();

    // Audit log
    await createAuditLog({
      user: req.user._id,
      action: "UPDATE",
      entity: "Payout",
      entityId: payout._id,
      changes: { status, transactionId },
      ip: req.clientIp || req.ip,
      userAgent: req.headers["user-agent"],
      details: `Payout ${status}: ₹${payout.amount}`,
    });

    return res.json({
      success: true,
      message: `Payout ${status} successfully`,
      data: payout,
    });
  } catch (error) {
    console.error("Update payout status error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update payout status",
    });
  }
};
