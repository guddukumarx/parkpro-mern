// models/Slot.js
import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    parking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parking',
      required: true,
    },
    slotNumber: {
      type: String,
      required: [true, 'Slot number is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['car', 'bike', 'truck', 'disabled', 'electric'],
      default: 'car',
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'maintenance'],
      default: 'available',
    },
    // Optional: track current booking to prevent double booking
    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique slot numbers per parking
slotSchema.index({ parking: 1, slotNumber: 1 }, { unique: true });

const Slot = mongoose.model('Slot', slotSchema);
export default Slot;