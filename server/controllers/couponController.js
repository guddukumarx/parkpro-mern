// controllers/couponController.js
import Coupon from "../models/Coupon.js";
import Parking from "../models/Parking.js";
import { createAuditLog } from "../services/auditService.js";

// @desc    Create a new coupon
// @route   POST /api/admin/coupons
// @access  Private (admin)
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minBookingAmount,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      applicableParkings,
      description,
      status,
    } = req.body;

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ success: false, message: "End date must be after start date" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      value,
      minBookingAmount: minBookingAmount || 0,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      applicableParkings: applicableParkings || [],
      applicableTo: applicableParkings?.length ? "specific" : "all",
      description,
      status: status || "active",
      createdBy: req.user._id,
    });

    // Audit log
    await createAuditLog({
      user: req.user._id,
      action: "CREATE",
      entity: "Coupon",
      entityId: coupon._id,
      changes: coupon.toObject(),
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Coupon created: ${coupon.code}`,
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all coupons (admin)
// @route   GET /api/admin/coupons
// @access  Private (admin)
export const getAllCoupons = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: { path: "createdBy", select: "name email" },
    };

    const coupons = await Coupon.find(query, null, options);
    const total = await Coupon.countDocuments(query);

    res.json({
      success: true,
      data: coupons,
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

// @desc    Get coupon by ID
// @route   GET /api/admin/coupons/:id
// @access  Private (admin)
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private (admin)
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }

    const oldData = coupon.toObject();
    const {
      code,
      type,
      value,
      minBookingAmount,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      applicableParkings,
      description,
      status,
    } = req.body;

    // Validate dates if both provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ success: false, message: "End date must be after start date" });
    }

    coupon.code = code ? code.toUpperCase() : coupon.code;
    if (type) coupon.type = type;
    if (value !== undefined) coupon.value = value;
    if (minBookingAmount !== undefined)
      coupon.minBookingAmount = minBookingAmount;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
    if (startDate) coupon.startDate = startDate;
    if (endDate) coupon.endDate = endDate;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (applicableParkings) {
      coupon.applicableParkings = applicableParkings;
      coupon.applicableTo = applicableParkings.length ? "specific" : "all";
    }
    if (description !== undefined) coupon.description = description;
    if (status) coupon.status = status;

    await coupon.save();

    // Audit log
    await createAuditLog({
      user: req.user._id,
      action: "UPDATE",
      entity: "Coupon",
      entityId: coupon._id,
      changes: { old: oldData, new: coupon.toObject() },
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Coupon updated: ${coupon.code}`,
    });

    res.json({ success: true, data: coupon });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private (admin)
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }

    await createAuditLog({
      user: req.user._id,
      action: "DELETE",
      entity: "Coupon",
      entityId: req.params.id,
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Coupon deleted: ${coupon.code}`,
    });

    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Validate a coupon code (public, used during booking)
// @route   POST /api/coupons/validate
// @access  Public (or user)
export const validateCoupon = async (req, res) => {
  try {
    const { code, parkingId, bookingAmount } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      status: "active",
    });
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or inactive coupon code" });
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon expired or not yet valid" });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon usage limit reached" });
    }

    if (bookingAmount < coupon.minBookingAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum booking amount of $${coupon.minBookingAmount} required`,
      });
    }

    // Check if applicable to this parking
    if (
      coupon.applicableTo === "specific" &&
      !coupon.applicableParkings.includes(parkingId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon not applicable to this parking",
      });
    }

    // Calculate discount
    let discountAmount;
    if (coupon.type === "percentage") {
      discountAmount = (bookingAmount * coupon.value) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    // Ensure discount doesn't exceed booking amount
    discountAmount = Math.min(discountAmount, bookingAmount);

    res.json({
      success: true,
      data: {
        coupon: {
          _id: coupon._id,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
        },
        discountAmount,
        finalAmount: bookingAmount - discountAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Owner: Get coupons for owner
export const getOwnerCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ owner: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Owner: Create coupon
export const createOwnerCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minBookingAmount,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      applicableParkings, // array of parking IDs (must belong to owner)
      description,
    } = req.body;

    // Validate that applicableParkings belong to this owner
    if (applicableParkings && applicableParkings.length > 0) {
      const parkings = await Parking.find({ _id: { $in: applicableParkings }, owner: req.user._id });
      if (parkings.length !== applicableParkings.length) {
        return res.status(400).json({ success: false, message: 'Some parkings do not belong to you' });
      }
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      value,
      minBookingAmount: minBookingAmount || 0,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      applicableParkings: applicableParkings || [],
      applicableTo: applicableParkings && applicableParkings.length ? 'specific' : 'all',
      description,
      status: 'active',
      createdBy: req.user._id,
      owner: req.user._id, // mark as owner-created
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Owner: Update coupon
export const updateOwnerCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ _id: req.params.id, owner: req.user._id });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const {
      code,
      type,
      value,
      minBookingAmount,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      applicableParkings,
      description,
      status,
    } = req.body;

    // Validate applicableParkings if provided
    if (applicableParkings) {
      const parkings = await Parking.find({ _id: { $in: applicableParkings }, owner: req.user._id });
      if (parkings.length !== applicableParkings.length) {
        return res.status(400).json({ success: false, message: 'Some parkings do not belong to you' });
      }
    }

    if (code) coupon.code = code.toUpperCase();
    if (type) coupon.type = type;
    if (value !== undefined) coupon.value = value;
    if (minBookingAmount !== undefined) coupon.minBookingAmount = minBookingAmount;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
    if (startDate) coupon.startDate = startDate;
    if (endDate) coupon.endDate = endDate;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (applicableParkings) {
      coupon.applicableParkings = applicableParkings;
      coupon.applicableTo = applicableParkings.length ? 'specific' : 'all';
    }
    if (description !== undefined) coupon.description = description;
    if (status) coupon.status = status;

    await coupon.save();
    res.json({ success: true, data: coupon });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Owner: Delete coupon
export const deleteOwnerCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Increment coupon usage (call after successful booking)
// @route   POST /api/coupons/:id/use
// @access  Private (server-side, could be called from booking controller)
export const useCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }
    coupon.usedCount += 1;
    await coupon.save();
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
