import StaffAssignment from '../models/StaffAssignment.js';
import User from '../models/User.js';
import Parking from '../models/Parking.js';
import bcrypt from 'bcryptjs';

// @desc    Get all staff for the logged-in owner
// @route   GET /api/owner/staff
// @access  Private (owner)
export const getStaff = async (req, res) => {
  try {
    const assignments = await StaffAssignment.find({ owner: req.user._id })
      .populate('staff', 'name email phone')
      .populate('parkings', 'name');
    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new staff member (creates a user account)
// @route   POST /api/owner/staff
// @access  Private (owner)
export const createStaff = async (req, res) => {
  try {
    const { name, email, password, phone, parkings, permissions } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Create staff user
    user = await User.create({
      name,
      email,
      password, // will be hashed by pre-save hook
      phone,
      role: 'staff',
    });

    // Create assignment
    const assignment = await StaffAssignment.create({
      owner: req.user._id,
      staff: user._id,
      parkings: parkings || [],
      permissions,
    });

    await assignment.populate('staff', 'name email phone');
    await assignment.populate('parkings', 'name');

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a staff member
// @route   PUT /api/owner/staff/:assignmentId
// @access  Private (owner)
export const updateStaff = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { name, email, phone, parkings, permissions, password } = req.body;

    const assignment = await StaffAssignment.findOne({
      _id: assignmentId,
      owner: req.user._id,
    }).populate('staff');
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    // Update user details
    const user = await User.findById(assignment.staff._id);
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = password; // will be hashed
    await user.save();

    // Update assignment
    if (parkings) assignment.parkings = parkings;
    if (permissions) {
      assignment.permissions = { ...assignment.permissions, ...permissions };
    }
    await assignment.save();

    await assignment.populate('parkings', 'name');

    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/owner/staff/:assignmentId
// @access  Private (owner)
export const deleteStaff = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await StaffAssignment.findOne({
      _id: assignmentId,
      owner: req.user._id,
    });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    // Delete the user account (or optionally just deactivate)
    await User.findByIdAndDelete(assignment.staff);
    await assignment.deleteOne();

    res.json({ success: true, message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};