// controllers/blacklistController.js
import Blacklist from "../models/Blacklist.js";
import Parking from "../models/Parking.js";

// @desc    Add a user to blacklist for a parking
// @route   POST /api/owner/parkings/:parkingId/blacklist
// @access  Private (owner only)
export const addToBlacklist = async (req, res) => {
  try {
    const { userId, reason } = req.body;
    const { parkingId } = req.params;

    // Check if parking belongs to owner
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

    // Check if already blacklisted
    const existing = await Blacklist.findOne({
      parking: parkingId,
      user: userId,
    });
    if (existing) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already blacklisted for this parking",
        });
    }

    const blacklistEntry = await Blacklist.create({
      parking: parkingId,
      user: userId,
      reason,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: blacklistEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove a user from blacklist
// @route   DELETE /api/owner/parkings/:parkingId/blacklist/:userId
// @access  Private (owner only)
export const removeFromBlacklist = async (req, res) => {
  try {
    const { parkingId, userId } = req.params;

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

    const result = await Blacklist.findOneAndDelete({
      parking: parkingId,
      user: userId,
    });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Blacklist entry not found" });
    }

    res.json({ success: true, message: "User removed from blacklist" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get blacklist for a parking (owner)
// @route   GET /api/owner/parkings/:parkingId/blacklist
// @access  Private (owner)
export const getBlacklist = async (req, res) => {
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

    const blacklist = await Blacklist.find({ parking: parkingId }).populate(
      "user",
      "name email",
    );
    res.json({ success: true, data: blacklist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check if a user is blacklisted (public? maybe used during booking)
// @route   GET /api/parkings/:parkingId/blacklist/check/:userId
// @access  Public (or authenticated)
export const checkBlacklist = async (req, res) => {
  try {
    const { parkingId, userId } = req.params;
    const entry = await Blacklist.findOne({ parking: parkingId, user: userId });
    res.json({ success: true, blacklisted: !!entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
