// controllers/authController.js
import User from "../models/User.js";
import crypto from "crypto";
import {
  generateToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt.js";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../services/emailService.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Determine owner approval status based on role
    let ownerApprovalStatus = "approved";
    if (role === "owner") {
      ownerApprovalStatus = "pending";
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
      ownerApprovalStatus,
    });

    // Generate tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail(user);
    } catch (emailErr) {
      console.error("Welcome email failed:", emailErr);
    }

    // Return user without sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(201).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Account deactivated, contact admin",
        });
    }

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user (clear refresh token)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (with refresh token)
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token required" });
    }

    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const user = await User.findOne({ _id: decoded.userId, refreshToken });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token not valid" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Account deactivated" });
    }

    const newToken = generateToken(user._id, user.role);
    res.json({ success: true, token: newToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success even if user not found (security)
    if (!user) {
      return res.json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Generate reset token (simple random string, could also use JWT)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    await sendPasswordResetEmail(user, resetUrl);

    res.json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Could not send reset email" });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token to compare with stored hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Could not reset password" });
  }
};
