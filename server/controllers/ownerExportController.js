import { Parser } from 'json2csv';
import XLSX from 'xlsx';
import Booking from '../models/Booking.js';
import Parking from '../models/Parking.js';
import User from '../models/User.js';
import Slot from '../models/Slot.js';

// @desc    Export owner data based on type and format
// @route   GET /api/owner/export/:type
// @access  Private (owner)
export const exportOwnerData = async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'csv' } = req.query;
    const ownerId = req.user._id;

    let data = [];
    let filename = type;

    // Fetch data based on type, filtered by owner
    switch (type) {
      case 'bookings':
        // Find all parkings owned by this owner
        const parkings = await Parking.find({ owner: ownerId }).select('_id');
        const parkingIds = parkings.map(p => p._id);
        data = await Booking.find({ parking: { $in: parkingIds } })
          .populate('user', 'name email')
          .populate('parking', 'name')
          .populate('slot', 'slotNumber')
          .lean();
        break;

      case 'parkings':
        data = await Parking.find({ owner: ownerId }).lean();
        break;

      case 'customers':
        // Get all unique users who booked at owner's parkings
        const bookings = await Booking.find({ parking: { $in: await Parking.find({ owner: ownerId }).distinct('_id') } })
          .populate('user')
          .lean();
        // Aggregate unique users with stats
        const userMap = new Map();
        bookings.forEach(b => {
          if (!b.user) return;
          const userId = b.user._id.toString();
          if (!userMap.has(userId)) {
            userMap.set(userId, {
              name: b.user.name,
              email: b.user.email,
              phone: b.user.phone,
              totalBookings: 0,
              totalSpent: 0,
            });
          }
          const userData = userMap.get(userId);
          userData.totalBookings += 1;
          userData.totalSpent += b.totalPrice || 0;
        });
        data = Array.from(userMap.values());
        filename = 'customers';
        break;

      case 'earnings':
        // Similar to bookings but aggregated
        const earningsData = await Booking.find({ 
          parking: { $in: await Parking.find({ owner: ownerId }).distinct('_id') },
          paymentStatus: 'paid'
        })
          .select('startTime endTime totalPrice createdAt')
          .lean();
        data = earningsData;
        filename = 'earnings';
        break;

      default:
        return res.status(400).json({ success: false, message: 'Invalid export type' });
    }

    // Format and send response
    if (format === 'csv') {
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(data);
      res.header('Content-Type', 'text/csv');
      res.attachment(`${filename}.csv`);
      return res.send(csv);
    } 
    else if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.attachment(`${filename}.xlsx`);
      return res.send(buffer);
    } 
    else if (format === 'json') {
      res.header('Content-Type', 'application/json');
      res.attachment(`${filename}.json`);
      return res.send(JSON.stringify(data, null, 2));
    } 
    else {
      return res.status(400).json({ success: false, message: 'Invalid format' });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};