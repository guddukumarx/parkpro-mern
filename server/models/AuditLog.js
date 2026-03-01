// models/AuditLog.js
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    // User who performed the action
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Action performed
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "APPROVE",
        "REJECT",
        "LOGIN",
        "LOGOUT",
        "PASSWORD_CHANGE",
        "ROLE_CHANGE",
        "STATUS_CHANGE",
        "REFUND",
        "SETTINGS_UPDATE",
        "PAYMENT_UPDATE",
        "BLACKLIST_ADD",
        "BLACKLIST_REMOVE",
        "MAINTENANCE_REQUEST",
        "COUPON_APPLY",
        "EXPORT_DATA",
        "BULK_ACTION",
      ],
    },
    // Entity type affected
    entity: {
      type: String,
      required: true,
      enum: [
        "User",
        "Parking",
        "Slot",
        "Booking",
        "Coupon",
        "Setting",
        "Owner",
        "MaintenanceRequest",
        "Blacklist",
        "Payout",
        "Notification",
        "EmailTemplate",
        "Report",
      ],
    },
    // ID of the entity affected (optional)
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "entity",
    },
    // Changes made (old vs new values)
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    // IP address of the requester
    ip: {
      type: String,
      default: null,
    },
    // User agent string
    userAgent: {
      type: String,
      default: null,
    },
    // Additional human-readable description
    details: {
      type: String,
      default: "",
    },
    // Optional status of the action (success/failure)
    status: {
      type: String,
      enum: ["success", "failure"],
      default: "success",
    },
    // Error message if status is failure
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

// Indexes for faster queries
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ status: 1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
