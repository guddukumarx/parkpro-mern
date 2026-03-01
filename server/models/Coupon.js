// models/Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    value: {
      type: Number,
      required: [true, "Discount value is required"],
      min: 0,
    },
    minBookingAmount: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: null, // only applicable for percentage type
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: null, // null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    applicableParkings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parking",
      },
    ], // empty = all parkings
    applicableTo: {
      type: String,
      enum: ["all", "specific"],
      default: "all",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster lookups
couponSchema.index({ code: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
