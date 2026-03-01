// controllers/parkingSettingsController.js
import Parking from "../models/Parking.js";

// @desc    Update operating hours for a parking
// @route   PATCH /api/owner/parkings/:id/hours
// @access  Private (owner)
export const updateOperatingHours = async (req, res) => {
  try {
    const { id } = req.params;
    const { operatingHours } = req.body;

    const parking = await Parking.findOne({ _id: id, owner: req.user._id });
    if (!parking) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Parking not found or not authorized",
        });
    }

    parking.operatingHours = operatingHours;
    await parking.save();

    res.json({ success: true, data: parking.operatingHours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a holiday to a parking
// @route   POST /api/owner/parkings/:id/holidays
// @access  Private (owner)
export const addHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, reason } = req.body;

    const parking = await Parking.findOne({ _id: id, owner: req.user._id });
    if (!parking) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Parking not found or not authorized",
        });
    }

    parking.holidays.push({ date, reason });
    await parking.save();

    res.status(201).json({ success: true, data: parking.holidays });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove a holiday
// @route   DELETE /api/owner/parkings/:id/holidays/:holidayId
// @access  Private (owner)
export const removeHoliday = async (req, res) => {
  try {
    const { id, holidayId } = req.params;

    const parking = await Parking.findOne({ _id: id, owner: req.user._id });
    if (!parking) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Parking not found or not authorized",
        });
    }

    parking.holidays = parking.holidays.filter(
      (h) => h._id.toString() !== holidayId,
    );
    await parking.save();

    res.json({ success: true, data: parking.holidays });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cancellation policy
// @route   PATCH /api/owner/parkings/:id/cancellation-policy
// @access  Private (owner)
export const updateCancellationPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationPolicy } = req.body;

    const parking = await Parking.findOne({ _id: id, owner: req.user._id });
    if (!parking) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Parking not found or not authorized",
        });
    }

    parking.cancellationPolicy = cancellationPolicy;
    await parking.save();

    res.json({ success: true, data: parking.cancellationPolicy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
