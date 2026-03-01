// controllers/ownerEarningsController.js
import Booking from "../models/Booking.js";
import Parking from "../models/Parking.js";
import Payout from "../models/Payout.js"; // 👈 ADD THIS

// @desc    Get earnings summary and chart data for the logged-in owner
// @route   GET /api/owner/earnings
// @access  Private (owner)
export const getOwnerEarnings = async (req, res) => {
  try {
    const { period = "month" } = req.query; // 'week', 'month', 'year'
    const ownerId = req.user._id;

    // Find all parkings owned by this owner
    const parkings = await Parking.find({ owner: ownerId }).select("_id");
    const parkingIds = parkings.map((p) => p._id);

    if (parkingIds.length === 0) {
      return res.json({
        success: true,
        data: {
          summary: { today: 0, week: 0, month: 0, total: 0 },
          chartData: [],
          availableBalance: 0, // 👈 ADD THIS
        },
      });
    }

    // Base query: bookings on these parkings with paid status
    const baseQuery = { parking: { $in: parkingIds }, paymentStatus: "paid" };

    // Get total earnings all-time
    const allBookings = await Booking.find(baseQuery);
    const total = allBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Date ranges
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday start
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Today's earnings
    const todayBookings = await Booking.find({
      ...baseQuery,
      createdAt: { $gte: startOfDay },
    });
    const today = todayBookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0,
    );

    // This week's earnings
    const weekBookings = await Booking.find({
      ...baseQuery,
      createdAt: { $gte: startOfWeek },
    });
    const week = weekBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // This month's earnings
    const monthBookings = await Booking.find({
      ...baseQuery,
      createdAt: { $gte: startOfMonth },
    });
    const month = monthBookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0,
    );

    // ----- NEW: Calculate available balance -----
    // Total pending payouts (pending or processing)
    const pendingPayoutsAgg = await Payout.aggregate([
      {
        $match: { owner: ownerId, status: { $in: ["pending", "processing"] } },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const pendingPayouts = pendingPayoutsAgg[0]?.total || 0;
    const availableBalance = total - pendingPayouts;
    // --------------------------------------------

    // Chart data: aggregate by day/week/month based on period
    let chartData = [];
    const matchQuery = { parking: { $in: parkingIds }, paymentStatus: "paid" };

    if (period === "week") {
      // Last 7 days
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const start = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );
        const end = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1,
        );
        const dayBookings = await Booking.find({
          ...matchQuery,
          createdAt: { $gte: start, $lt: end },
        });
        const earnings = dayBookings.reduce(
          (sum, b) => sum + (b.totalPrice || 0),
          0,
        );
        chartData.push({ date: dayNames[date.getDay()], earnings });
      }
    } else if (period === "month") {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const start = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );
        const end = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1,
        );
        const dayBookings = await Booking.find({
          ...matchQuery,
          createdAt: { $gte: start, $lt: end },
        });
        const earnings = dayBookings.reduce(
          (sum, b) => sum + (b.totalPrice || 0),
          0,
        );
        chartData.push({
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          earnings,
        });
      }
    } else if (period === "year") {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const start = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth(),
          1,
        );
        const end = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth() + 1,
          0,
          23,
          59,
          59,
        );
        const monthBookings = await Booking.find({
          ...matchQuery,
          createdAt: { $gte: start, $lte: end },
        });
        const earnings = monthBookings.reduce(
          (sum, b) => sum + (b.totalPrice || 0),
          0,
        );
        chartData.push({
          date: monthDate.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          earnings,
        });
      }
    }

    res.json({
      success: true,
      data: {
        summary: { today, week, month, total },
        chartData,
        availableBalance, // 👈 NEW FIELD
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
