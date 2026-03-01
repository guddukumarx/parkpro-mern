import { Parser } from 'json2csv';
import XLSX from 'xlsx';
import User from '../models/User.js';
import Parking from '../models/Parking.js';
import Booking from '../models/Booking.js';

// @desc    Export data based on type and format
// @route   GET /api/admin/export/:type
// @access  Private (admin)
export const exportData = async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'csv' } = req.query;

    let data = [];
    let filename = type;

    // Fetch data based on type
    switch (type) {
      case 'users':
        data = await User.find().select('-password -refreshToken').lean();
        break;
      case 'owners':
        data = await User.find({ role: 'owner' }).select('-password -refreshToken').lean();
        break;
      case 'parkings':
        data = await Parking.find().populate('owner', 'name email').lean();
        break;
      case 'bookings':
        data = await Booking.find()
          .populate('user', 'name email')
          .populate('parking', 'name')
          .populate('slot', 'slotNumber')
          .lean();
        break;
      case 'payments':
        data = await Booking.find({ paymentStatus: { $ne: 'pending' } })
          .populate('user', 'name email')
          .populate('parking', 'name')
          .lean();
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