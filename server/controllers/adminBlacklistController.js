// controllers/adminBlacklistController.js
import Blacklist from '../models/Blacklist.js';
import { createAuditLog } from '../services/auditService.js';

// @desc    Get all blacklist entries (admin)
// @route   GET /api/admin/blacklist
// @access  Private (admin)
export const getAllBlacklist = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'parking', select: 'name' },
        { path: 'user', select: 'name email' },
        { path: 'createdBy', select: 'name email' },
      ],
    };
    const blacklist = await Blacklist.find({}, null, options);
    const total = await Blacklist.countDocuments();
    res.json({
      success: true,
      data: blacklist,
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

// @desc    Remove an entry from blacklist (admin)
// @route   DELETE /api/admin/blacklist/:entryId
// @access  Private (admin)
export const removeFromBlacklist = async (req, res) => {
  try {
    const { entryId } = req.params;
    const entry = await Blacklist.findByIdAndDelete(entryId);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Blacklist entry not found' });
    }

    await createAuditLog({
      user: req.user._id,
      action: 'DELETE',
      entity: 'Blacklist',
      entityId: entryId,
      ip: req.clientIp,
      userAgent: req.userAgent,
      details: `Blacklist entry removed for user ${entry.user} from parking ${entry.parking}`,
    });

    res.json({ success: true, message: 'User removed from blacklist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};