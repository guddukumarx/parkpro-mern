// controllers/adminSettingsController.js
import Setting from '../models/Setting.js';

// @desc    Get all settings
// @route   GET /api/admin/settings
// @access  Private (admin)
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    // Convert to key-value object for frontend
    const settingsObj = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
    res.json({ success: true, data: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update multiple settings
// @route   PATCH /api/admin/settings
// @access  Private (admin)
export const updateSettings = async (req, res) => {
  try {
    const updates = req.body; // { key: value, ... }
    const operations = Object.entries(updates).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { key, value },
        upsert: true,
      },
    }));
    await Setting.bulkWrite(operations);
    // Fetch updated settings
    const settings = await Setting.find();
    const settingsObj = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
    res.json({ success: true, data: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};