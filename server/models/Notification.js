// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["email", "in-app", "both"],
      default: "in-app",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailError: String,
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
