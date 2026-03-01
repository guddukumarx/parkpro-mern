// controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    // req.user already set by protect middleware (without password)
    res.json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/userController.js (or a new controller)
export const searchUsersByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email query required" });
    }
    // Search users with email containing the query (case insensitive)
    const users = await User.find({
      email: { $regex: email, $options: "i" },
    }).select("name email");
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Update current user profile
// @route   PATCH /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (avatar) updateFields.avatar = avatar;

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true },
    ).select("-password -refreshToken");

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   POST /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide current and new password",
        });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be at least 6 characters",
        });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    // Set new password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete current user account (self-delete)
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    // Optionally, you might want to delete related data (bookings, etc.)
    // For now, just delete user.

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
