// controllers/ownerReportController.js
import Booking from "../models/Booking.js";
import Parking from "../models/Parking.js";

// @desc    Get revenue reports for owner
// @route   GET /api/owner/reports/revenue
// @access  Private (owner)
export const getRevenueReports = async (req, res) => {
  try {
    const { period, year, month } = req.query;
    const ownerId = req.user._id;

    // Find all parkings owned by this owner
    const parkings = await Parking.find({ owner: ownerId }).select("_id");
    const parkingIds = parkings.map((p) => p._id);

    if (parkingIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Build date filter based on period
    let startDate, endDate;
    const now = new Date();
    if (period === "monthly" && year && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } else if (period === "quarterly" && year && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month + 2, 0, 23, 59, 59);
    } else if (period === "yearly" && year) {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    } else {
      // default to current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    const bookings = await Booking.find({
      parking: { $in: parkingIds },
      paymentStatus: "paid",
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Group by day/week/month according to period
    const grouped = {};
    bookings.forEach((b) => {
      const d = new Date(b.createdAt);
      let key;
      if (period === "daily") key = d.toISOString().split("T")[0];
      else if (period === "monthly")
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      else if (period === "yearly") key = `${d.getFullYear()}`;
      else
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // default monthly

      if (!grouped[key]) grouped[key] = { revenue: 0, bookings: 0 };
      grouped[key].revenue += b.totalPrice;
      grouped[key].bookings += 1;
    });

    const chartData = Object.entries(grouped)
      .map(([date, values]) => ({
        date,
        revenue: values.revenue,
        bookings: values.bookings,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({ success: true, data: chartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking reports (e.g., by type) for owner
// @route   GET /api/owner/reports/bookings
// @access  Private (owner)
export const getBookingReports = async (req, res) => {
  try {
    const { period, year, month } = req.query;
    const ownerId = req.user._id;

    const parkings = await Parking.find({ owner: ownerId }).select("_id");
    const parkingIds = parkings.map((p) => p._id);

    if (parkingIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Build date filter (similar to above)
    let startDate, endDate;
    const now = new Date();
    if (period === "monthly" && year && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    const bookings = await Booking.find({
      parking: { $in: parkingIds },
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Example grouping by status for pie chart
    const statusCount = {};
    bookings.forEach((b) => {
      statusCount[b.status] = (statusCount[b.status] || 0) + 1;
    });

    const chartData = Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
    }));

    res.json({ success: true, data: chartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
