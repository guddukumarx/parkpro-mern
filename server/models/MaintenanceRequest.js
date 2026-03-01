// models/MaintenanceRequest.js
import mongoose from "mongoose";

const maintenanceRequestSchema = new mongoose.Schema(
  {
    parking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "closed"],
      default: "pending",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolutionNotes: String,
    resolvedAt: Date,
  },
  {
    timestamps: true,
  },
);

const MaintenanceRequest = mongoose.model(
  "MaintenanceRequest",
  maintenanceRequestSchema,
);
export default MaintenanceRequest;
