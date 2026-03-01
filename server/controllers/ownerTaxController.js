import Booking from '../models/Booking.js';
import Parking from '../models/Parking.js';
import Setting from '../models/Setting.js';

// @desc    Get tax reports for owner (monthly/quarterly/yearly)
// @route   GET /api/owner/tax-reports
// @access  Private (owner)
export const getTaxReports = async (req, res) => {
  try {
    const { period = 'monthly', year, month } = req.query;
    const ownerId = req.user._id;

    // Get tax rate from settings (global)
    const taxSetting = await Setting.findOne({ key: 'taxRate' });
    const taxRate = taxSetting ? parseFloat(taxSetting.value) : 0; // default 0 if not set

    // Find all parkings owned by this owner
    const parkings = await Parking.find({ owner: ownerId }).select('_id');
    const parkingIds = parkings.map(p => p._id);

    if (parkingIds.length === 0) {
      return res.json({ success: true, data: [], summary: { totalEarnings: 0, totalTax: 0, taxableAmount: 0 } });
    }

    // Build date filter based on period
    const dateFilter = {};
    const now = new Date();
    let startDate, endDate;

    if (period === 'monthly' && year && month) {
      // specific month: year-month (1-12)
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } else if (period === 'quarterly' && year && month) {
      // month is the starting month of quarter (1,4,7,10)
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month + 2, 0, 23, 59, 59);
    } else if (period === 'yearly' && year) {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    } else {
      // default to current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    dateFilter.createdAt = { $gte: startDate, $lte: endDate };

    // Fetch bookings in that period with paymentStatus = 'paid'
    const bookings = await Booking.find({
      parking: { $in: parkingIds },
      paymentStatus: 'paid',
      ...dateFilter,
    }).populate('parking', 'name');

    // Group by month/quarter/year for chart data
    const groupedData = {};
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      let key;
      if (period === 'monthly') key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      else if (period === 'quarterly') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
      } else {
        key = `${date.getFullYear()}`;
      }
      if (!groupedData[key]) groupedData[key] = { earnings: 0, count: 0 };
      groupedData[key].earnings += booking.totalPrice;
      groupedData[key].count += 1;
    });

    // Format chart data
    const chartData = Object.entries(groupedData).map(([label, data]) => ({
      label,
      earnings: data.earnings,
      bookings: data.count,
      tax: data.earnings * (taxRate / 100),
    }));

    // Summary totals
    const totalEarnings = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalTax = totalEarnings * (taxRate / 100);
    const taxableAmount = totalEarnings; // assuming all earnings are taxable

    res.json({
      success: true,
      data: chartData,
      summary: {
        totalEarnings,
        totalTax,
        taxableAmount,
        taxRate,
        period,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};