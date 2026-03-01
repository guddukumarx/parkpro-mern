// models/Parking.js (updated)
import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema(
  {
    // existing fields...
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    totalSlots: { type: Number, default: 0 },
    availableSlots: { type: Number, default: 0 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [String],
    amenities: [String],
    description: String,
    pricePerHour: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },

    // New fields for operating hours & holidays
    operatingHours: {
      monday: {
        open: String,
        close: String,
        closed: { type: Boolean, default: false },
      },
      tuesday: {
        open: String,
        close: String,
        closed: { type: Boolean, default: false },
      },
      wednesday: {
        open: String,
        close: String,
        closed: { type: Boolean, default: false },
      },
      thursday: {
        open: String,
        close: String,
        closed: { type: Boolean, default: false },
      },
      friday: {
        open: String,
        close: String,
        closed: { type: Boolean, default: false },
      },
      saturday: {
        open: String,
        close: String,
        closed: { type: Boolean, default: false },
      },
      sunday: {
        open: String,
        close: String,
        closed: { type: Boolean, default: false },
      },
    },
    holidays: [
      {
        date: Date,
        reason: String,
      },
    ],

    // New fields for cancellation policy
    cancellationPolicy: {
      freeCancellationBefore: Number, // hours before start time
      cancellationFee: Number, // percentage or fixed amount? Let's use percentage for simplicity
      feeType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      description: String,
    },
  },
  { timestamps: true },
);

parkingSchema.index({ location: "2dsphere" });

const Parking = mongoose.model("Parking", parkingSchema);
export default Parking;
