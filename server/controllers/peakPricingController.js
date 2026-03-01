import PeakPricingRule from "../models/PeakPricingRule.js";
import Parking from "../models/Parking.js";
import { createAuditLog } from "../services/auditService.js";

// @desc    Get all pricing rules for a parking
// @route   GET /api/owner/parkings/:parkingId/pricing
// @access  Private (owner)
export const getPricingRules = async (req, res) => {
  try {
    const { parkingId } = req.params;
    const parking = await Parking.findOne({
      _id: parkingId,
      owner: req.user._id,
    });
    if (!parking) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Parking not found or not authorized",
        });
    }
    const rules = await PeakPricingRule.find({ parking: parkingId }).sort({
      priority: -1,
    });
    res.json({ success: true, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new pricing rule
// @route   POST /api/owner/parkings/:parkingId/pricing
// @access  Private (owner)
export const createPricingRule = async (req, res) => {
  try {
    const { parkingId } = req.params;
    const parking = await Parking.findOne({
      _id: parkingId,
      owner: req.user._id,
    });
    if (!parking) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Parking not found or not authorized",
        });
    }
    const ruleData = { ...req.body, parking: parkingId };
    const rule = await PeakPricingRule.create(ruleData);
    await createAuditLog({
      user: req.user._id,
      action: "CREATE",
      entity: "PeakPricingRule",
      entityId: rule._id,
      changes: rule.toObject(),
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Peak pricing rule created for parking ${parking.name}`,
    });
    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a pricing rule
// @route   PUT /api/owner/parkings/:parkingId/pricing/:ruleId
// @access  Private (owner)
export const updatePricingRule = async (req, res) => {
  try {
    const { parkingId, ruleId } = req.params;
    const parking = await Parking.findOne({
      _id: parkingId,
      owner: req.user._id,
    });
    if (!parking) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Parking not found or not authorized",
        });
    }
    const rule = await PeakPricingRule.findOne({
      _id: ruleId,
      parking: parkingId,
    });
    if (!rule) {
      return res
        .status(404)
        .json({ success: false, message: "Rule not found" });
    }
    const oldData = rule.toObject();
    Object.assign(rule, req.body);
    await rule.save();
    await createAuditLog({
      user: req.user._id,
      action: "UPDATE",
      entity: "PeakPricingRule",
      entityId: rule._id,
      changes: { old: oldData, new: rule.toObject() },
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Peak pricing rule updated for parking ${parking.name}`,
    });
    res.json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a pricing rule
// @route   DELETE /api/owner/parkings/:parkingId/pricing/:ruleId
// @access  Private (owner)
export const deletePricingRule = async (req, res) => {
  try {
    const { parkingId, ruleId } = req.params;
    const parking = await Parking.findOne({
      _id: parkingId,
      owner: req.user._id,
    });
    if (!parking) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Parking not found or not authorized",
        });
    }
    const rule = await PeakPricingRule.findOneAndDelete({
      _id: ruleId,
      parking: parkingId,
    });
    if (!rule) {
      return res
        .status(404)
        .json({ success: false, message: "Rule not found" });
    }
    await createAuditLog({
      user: req.user._id,
      action: "DELETE",
      entity: "PeakPricingRule",
      entityId: ruleId,
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Peak pricing rule deleted for parking ${parking.name}`,
    });
    res.json({ success: true, message: "Rule deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Utility function to calculate price for a given slot and time (used during booking)
export const calculateDynamicPrice = async (slot, startTime, endTime) => {
  // Fetch all enabled rules for the parking
  const rules = await PeakPricingRule.find({
    parking: slot.parking,
    enabled: true,
  }).sort({ priority: -1 });
  if (rules.length === 0) return slot.pricePerHour; // base price

  const start = new Date(startTime);
  const end = new Date(endTime);
  let multiplier = 1; // no adjustment

  // Find the first rule that matches (highest priority)
  for (const rule of rules) {
    // Check day of week if specified
    if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
      const day = start.getDay(); // 0-6
      if (!rule.daysOfWeek.includes(day)) continue;
    }
    // Check time range if specified
    if (rule.timeRange && rule.timeRange.start && rule.timeRange.end) {
      const startHourMin = start.getHours() * 60 + start.getMinutes();
      const ruleStart =
        parseInt(rule.timeRange.start.split(":")[0]) * 60 +
        parseInt(rule.timeRange.start.split(":")[1]);
      const ruleEnd =
        parseInt(rule.timeRange.end.split(":")[0]) * 60 +
        parseInt(rule.timeRange.end.split(":")[1]);
      // If booking spans multiple hours, we may need to consider overlapping. For simplicity, we check if start time falls within rule.
      // For production, you might want more sophisticated handling.
      if (startHourMin < ruleStart || startHourMin >= ruleEnd) continue;
    }
    // Check date range if specified
    if (rule.dateRange && rule.dateRange.start && rule.dateRange.end) {
      const ruleStart = new Date(rule.dateRange.start);
      const ruleEnd = new Date(rule.dateRange.end);
      if (start < ruleStart || start > ruleEnd) continue;
    }
    // Rule matched – apply adjustment
    if (rule.adjustmentType === "fixed") {
      return slot.pricePerHour + rule.adjustmentValue;
    } else {
      // percentage
      const factor = 1 + rule.adjustmentValue / 100;
      return slot.pricePerHour * factor;
    }
  }
  return slot.pricePerHour;
};
