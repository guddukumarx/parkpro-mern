// controllers/adminAuditController.js
import AuditLog from '../models/AuditLog.js';

// @desc    Get audit logs with filters and pagination
// @route   GET /api/admin/audit-logs
// @access  Private (admin)
export const getAuditLogs = async (req, res) => {
  try {
    const { 
      userId, action, entity, 
      from, to, 
      page = 1, limit = 20 
    } = req.query;

    const filter = {};
    if (userId) filter.user = userId;
    if (action) filter.action = action;
    if (entity) filter.entity = entity;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: { path: 'user', select: 'name email' },
    };

    const logs = await AuditLog.find(filter, null, options);
    const total = await AuditLog.countDocuments(filter);

    res.json({
      success: true,
      data: logs,
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