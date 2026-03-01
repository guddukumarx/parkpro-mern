// controllers/adminUserController.js
import User from '../models/User.js';

// @desc    Get all users (admin only) with pagination and filters
// @route   GET /api/admin/users
// @access  Private (admin)
export const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: '-password -refreshToken',
    };

    const users = await User.find(query, null, options);
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
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

// @desc    Get user by ID (admin only)
// @route   GET /api/admin/users/:id
// @access  Private (admin)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (admin only)
// @route   PATCH /api/admin/users/:id/role
// @access  Private (admin)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['user', 'owner', 'admin', 'staff'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from changing their own role? (optional)
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active status (block/unblock)
// @route   PATCH /api/admin/users/:id/toggle-status
// @access  Private (admin)
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot change your own status' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      data: user,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};