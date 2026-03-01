import StaffAssignment from "../models/StaffAssignment.js";
import Parking from "../models/Parking.js";
import Booking from "../models/Booking.js";

// @desc    Get staff dashboard data (assigned parkings, permissions)
// @route   GET /api/staff/dashboard
// @access  Private (staff)
export const getStaffDashboard = async (req, res) => {
  try {
    const assignment = await StaffAssignment.findOne({ staff: req.user._id })
      .populate("parkings")
      .populate("owner", "name email");
    if (!assignment) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Determine which parkings to show
    let parkings;
    if (assignment.parkings.length === 0) {
      // All owner's parkings
      parkings = await Parking.find({ owner: assignment.owner._id });
    } else {
      parkings = await Parking.find({ _id: { $in: assignment.parkings } });
    }

    // If permission to view bookings, fetch recent bookings for these parkings
    let recentBookings = [];
    if (assignment.permissions.viewBookings) {
      const parkingIds = parkings.map((p) => p._id);
      recentBookings = await Booking.find({ parking: { $in: parkingIds } })
        .sort("-createdAt")
        .limit(5)
        .populate("slot");
    }

    res.json({
      success: true,
      data: {
        assignment,
        parkings,
        recentBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getParkingSlots = async (req, res) => {
  try {
    const { parkingId } = req.params;
    const assignment = await StaffAssignment.findOne({ staff: req.user._id });
    if (!assignment)
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    // Check if staff can access this parking
    if (
      assignment.parkings.length > 0 &&
      !assignment.parkings.includes(parkingId)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to this parking" });
    }

    if (
      !assignment.permissions.manageSlots &&
      !assignment.permissions.viewBookings
    ) {
      return res
        .status(403)
        .json({ success: false, message: "No permission to view slots" });
    }

    const slots = await Slot.find({ parking: parkingId });
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSlotStatus = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { status } = req.body;
    const slot = await Slot.findById(slotId).populate("parking");
    if (!slot)
      return res
        .status(404)
        .json({ success: false, message: "Slot not found" });

    const assignment = await StaffAssignment.findOne({ staff: req.user._id });
    if (!assignment)
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    // Check parking access
    if (
      assignment.parkings.length > 0 &&
      !assignment.parkings.includes(slot.parking._id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to this parking" });
    }

    if (!assignment.permissions.manageSlots) {
      return res
        .status(403)
        .json({ success: false, message: "No permission to manage slots" });
    }

    slot.status = status;
    await slot.save();

    // Notify via socket
    const { getIO } = await import("../socket/socket.js");
    getIO().to(`parking-${slot.parking._id}`).emit("slot-update", slot);

    res.json({ success: true, data: slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
