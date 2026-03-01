// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
        "disputed",
        "cancelled",
        "processing",
        "on_hold",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: [
        "card",
        "cash",
        "online",
        "wallet",
        "bank_transfer",
        "other",
        null,
      ],
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
    vehicleNumber: String,
    notes: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancellationReason: String,
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: String,
    refundedAt: Date,
    paymentHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        reason: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Indexes for faster queries
bookingSchema.index({ user: 1, startTime: -1 });
bookingSchema.index({ parking: 1, startTime: -1 });
bookingSchema.index({ slot: 1, startTime: -1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ transactionId: 1 }, { sparse: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
