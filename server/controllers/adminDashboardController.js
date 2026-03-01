// controllers/adminDashboardController.js
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Parking from '../models/Parking.js';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (admin)
export const getDashboardStats = async (req, res) => {
  try {
    // Date range for filtering (optional)
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Run aggregations in parallel for efficiency
    const [
      totalUsers,
      totalOwners,
      totalBookings,
      activeBookings,
      totalRevenue,
      pendingOwners,
      totalParkings,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'owner' }),
      Booking.countDocuments(dateFilter),
      Booking.countDocuments({ ...dateFilter, status: { $in: ['confirmed', 'active'] } }),
      Booking.aggregate([
        { $match: { ...dateFilter, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      User.countDocuments({ role: 'owner', ownerApprovalStatus: 'pending' }),
      Parking.countDocuments(),
    ]);

    // Recent activities (last 5 bookings and users)
    const recentBookings = await Booking.find(dateFilter)
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email')
      .populate('parking', 'name');
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('name email role createdAt');

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          owners: totalOwners,
          pendingOwners,
        },
        bookings: {
          total: totalBookings,
          active: activeBookings,
        },
        revenue: totalRevenue[0]?.total || 0,
        parkings: totalParkings,
        recent: {
          bookings: recentBookings,
          users: recentUsers,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};