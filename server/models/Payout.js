// models/Payout.js
import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // faster queries
    },

    amount: {
      type: Number,
      required: true,
      min: [0, "Payout amount cannot be negative"],
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "paypal", "stripe", "cash", "other"],
      required: true,
      default: "bank_transfer",
    },

    // Timestamp when owner requested the payout
    requestedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Flexible account details (bank/PayPal/Stripe info)
    accountDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Admin notes (optional)
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Admin who processed the payout
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    processedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
    },

    // External transaction reference (e.g., bank transfer ID)
    transactionId: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  },
);

// Compound indexes for common queries
payoutSchema.index({ owner: 1, status: 1 });
payoutSchema.index({ status: 1, requestedAt: -1 });

const Payout = mongoose.model("Payout", payoutSchema);

export default Payout;
