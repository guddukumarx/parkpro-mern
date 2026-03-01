// routes/adminRoutes.js
import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { sendBulkNotification } from "../controllers/notificationController.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
} from "../controllers/adminUserController.js";
import {
  getAllParkingsAdmin,
  updateParkingAdmin,
  deleteParkingAdmin,
} from "../controllers/parkingController.js";
import {
  getAllBookings,
  refundBooking,
  updatePaymentStatus, // 👈 NEW import
} from "../controllers/bookingController.js";
import { getDashboardStats } from "../controllers/adminDashboardController.js";
import { getPlatformReports } from "../controllers/adminReportController.js";
import { exportData } from "../controllers/exportController.js";
import {
  getPendingOwners,
  approveOwner,
  rejectOwner,
} from "../controllers/adminOwnerController.js";
import {
  getSettings,
  updateSettings,
} from "../controllers/adminSettingsController.js";
import { getLogs } from "../controllers/adminLogController.js";
import { getAuditLogs } from "../controllers/adminAuditController.js";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import {
  getAllPayouts,
  updatePayoutStatus,
} from "../controllers/payoutController.js";
import {
  getAllMaintenanceRequests,
  updateMaintenanceRequest,
} from "../controllers/maintenanceController.js";
import { getAllBlacklist } from "../controllers/adminBlacklistController.js";
import { removeFromBlacklist } from "../controllers/adminBlacklistController.js";

import {
  getAllTemplates,
  getTemplateByName,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../controllers/emailTemplateController.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, authorize("admin"));

// Email Templates
router.get("/email-templates", getAllTemplates);
router.get("/email-templates/:name", getTemplateByName);
router.post("/email-templates", createTemplate);
router.put("/email-templates/:name", updateTemplate);
router.delete("/email-templates/:name", deleteTemplate);

// Dashboard & Reports
router.get("/dashboard/stats", getDashboardStats);
router.get("/reports", getPlatformReports);

// Users
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/toggle-status", toggleUserStatus);

// Parkings
router.get("/parkings", getAllParkingsAdmin);
router.put("/parkings/:id", updateParkingAdmin);
router.delete("/parkings/:id", deleteParkingAdmin);

// Bookings
router.get("/bookings", getAllBookings);
router.post("/bookings/:id/refund", refundBooking);
router.patch("/bookings/:id/payment-status", updatePaymentStatus); // 👈 NEW route

// Owner approvals
router.get("/owners/pending", getPendingOwners);
router.post("/owners/:ownerId/approve", approveOwner);
router.post("/owners/:ownerId/reject", rejectOwner);

// Notifications
router.post("/notifications/send", sendBulkNotification);

// Settings
router.get("/settings", getSettings);
router.patch("/settings", updateSettings);

// Logs
router.get("/logs", getLogs);

// Audit Logs
router.get("/audit-logs", getAuditLogs);

// Coupons
router.post("/coupons", createCoupon);
router.get("/coupons", getAllCoupons);
router.get("/coupons/:id", getCouponById);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

// Payouts
router.get("/payouts", getAllPayouts);
router.patch("/payouts/:id/status", updatePayoutStatus);

// Maintenance
router.get("/maintenance", getAllMaintenanceRequests);
router.patch("/maintenance/:id", updateMaintenanceRequest);

// Export
router.get("/export/:type", exportData);

// Blacklist (global view)
router.get("/blacklist", getAllBlacklist);
router.delete("/blacklist/:entryId", removeFromBlacklist);

export default router;
