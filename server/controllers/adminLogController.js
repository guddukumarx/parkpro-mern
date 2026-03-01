// controllers/adminLogController.js
import Log from '../models/Log.js';

// @desc    Get system logs with filters
// @route   GET /api/admin/logs
// @access  Private (admin)
export const getLogs = async (req, res) => {
  try {
    const { level, from, to, limit = 100 } = req.query;
    const filter = {};
    if (level) filter.level = level;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    const logs = await Log.find(filter)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .populate('user', 'name email');
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};