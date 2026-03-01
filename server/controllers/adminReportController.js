// controllers/adminReportController.js
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// @desc    Get platform reports (revenue, bookings, user growth)
// @route   GET /api/admin/reports
// @access  Private (admin)
export const getPlatformReports = async (req, res) => {
  try {
    const { type = 'daily', from, to } = req.query;

    // Default to last 30 days if no range provided
    const endDate = to ? new Date(to) : new Date();
    const startDate = from ? new Date(from) : new Date(endDate);
    if (!from) startDate.setDate(endDate.getDate() - 30);

    const dateFilter = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    // Group by date based on type
    let groupBy;
    switch (type) {
      case 'hourly':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' },
        };
        break;
      case 'daily':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        };
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        };
        break;
      default:
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        };
    }

    // Revenue over time
    const revenueData = await Booking.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'paid' } },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } },
    ]);

    // User growth
    const userGrowth = await User.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupBy,
          newUsers: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } },
    ]);

    // Format dates for frontend
    const formatDate = (group) => {
      if (type === 'hourly') {
        return `${group.year}-${String(group.month).padStart(2, '0')}-${String(group.day).padStart(2, '0')} ${String(group.hour).padStart(2, '0')}:00`;
      } else if (type === 'daily') {
        return `${group.year}-${String(group.month).padStart(2, '0')}-${String(group.day).padStart(2, '0')}`;
      } else {
        return `${group.year}-${String(group.month).padStart(2, '0')}`;
      }
    };

    const revenue = revenueData.map(item => ({
      date: formatDate(item._id),
      revenue: item.revenue,
      bookings: item.count,
    }));

    const users = userGrowth.map(item => ({
      date: formatDate(item._id),
      newUsers: item.newUsers,
    }));

    res.json({
      success: true,
      data: {
        revenue,
        userGrowth: users,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};