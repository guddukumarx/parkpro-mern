import mongoose from 'mongoose';

const staffAssignmentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // each staff can be assigned to only one owner
  },
  parkings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
  }], // empty = all owner's parkings
  permissions: {
    manageSlots: { type: Boolean, default: false },
    viewBookings: { type: Boolean, default: false },
    manageBookings: { type: Boolean, default: false }, // check-in/out
    viewReports: { type: Boolean, default: false },
    manageStaff: { type: Boolean, default: false }, // only for managers
  },
}, {
  timestamps: true,
});

const StaffAssignment = mongoose.model('StaffAssignment', staffAssignmentSchema);
export default StaffAssignment;