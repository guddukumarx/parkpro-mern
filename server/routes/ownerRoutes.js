// routes/ownerRoutes.js
import express from "express";
import { protect, authorize } from "../middleware/auth.js";

import {
  getOwnerParkings,
  createParking,
  updateParking,
  deleteParking,
  getSlotsByParking,
  addSlot,
  updateSlot,
  deleteSlot,
} from "../controllers/parkingController.js";

import { getOwnerBookings } from "../controllers/bookingController.js";

import {
  getPricingRules,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
} from "../controllers/peakPricingController.js";

import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";

import {
  addToBlacklist,
  removeFromBlacklist,
  getBlacklist,
} from "../controllers/blacklistController.js";

import {
  updateOperatingHours,
  addHoliday,
  removeHoliday,
  updateCancellationPolicy,
} from "../controllers/parkingSettingsController.js";

import { getOwnerMaintenanceRequests } from "../controllers/maintenanceController.js";
import {
  getOwnerPayouts,
  requestPayout,
  cancelOwnerPayout,
} from "../controllers/payoutController.js";
import {
  getOwnerCoupons,
  createOwnerCoupon,
  updateOwnerCoupon,
  deleteOwnerCoupon,
} from "../controllers/couponController.js";
import { getTaxReports } from "../controllers/ownerTaxController.js";
import { exportOwnerData } from "../controllers/ownerExportController.js";
import { searchUsersByEmail } from "../controllers/userController.js";
import { getOwnerEarnings } from "../controllers/ownerEarningsController.js";
import {
  getRevenueReports,
  getBookingReports,
} from "../controllers/ownerReportController.js";

const router = express.Router();

// protect all routes
router.use(protect, authorize("owner"));

/* ================= PARKING ================= */

router.get("/parkings", getOwnerParkings);
router.post("/parkings", createParking);
router.put("/parkings/:parkingId", updateParking);
router.delete("/parkings/:parkingId", deleteParking);

/* ================= SLOTS ================= */

router.get("/parkings/:parkingId/slots", getSlotsByParking);
router.post("/parkings/:parkingId/slots", addSlot);
router.put("/slots/:slotId", updateSlot);
router.delete("/slots/:slotId", deleteSlot);

/* ================= EARNINGS ================= */

router.get("/earnings", getOwnerEarnings);

/* ================= BLACKLIST ================= */

router.get("/parkings/:parkingId/blacklist", getBlacklist);
router.post("/parkings/:parkingId/blacklist", addToBlacklist);
router.delete("/parkings/:parkingId/blacklist/:userId", removeFromBlacklist);

/* ================= SETTINGS ================= */

router.patch("/parkings/:parkingId/hours", updateOperatingHours);
router.post("/parkings/:parkingId/holidays", addHoliday);
router.delete("/parkings/:parkingId/holidays/:holidayId", removeHoliday);
router.patch(
  "/parkings/:parkingId/cancellation-policy",
  updateCancellationPolicy,
);

/* ================= PRICING ================= */

router.get("/parkings/:parkingId/pricing", getPricingRules);
router.post("/parkings/:parkingId/pricing", createPricingRule);
router.put("/parkings/:parkingId/pricing/:ruleId", updatePricingRule);
router.delete("/parkings/:parkingId/pricing/:ruleId", deletePricingRule);

/* ================= BOOKINGS ================= */

router.get("/bookings", getOwnerBookings);

/* ================= STAFF ================= */

router.get("/staff", getStaff);
router.post("/staff", createStaff);
router.put("/staff/:assignmentId", updateStaff);
router.delete("/staff/:assignmentId", deleteStaff);

/* ================= MAINTENANCE ================= */

router.get("/maintenance", getOwnerMaintenanceRequests);

/* ================= PAYOUT ================= */

router.get("/payouts", getOwnerPayouts);
router.post("/payouts", requestPayout); 
router.put("/payouts/:id/cancel", cancelOwnerPayout);

/* ================= COUPONS ================= */

router.get("/coupons", getOwnerCoupons);
router.post("/coupons", createOwnerCoupon);
router.put("/coupons/:id", updateOwnerCoupon);
router.delete("/coupons/:id", deleteOwnerCoupon);

/* ================= REPORTS ================= */

router.get("/reports/revenue", getRevenueReports);
router.get("/reports/bookings", getBookingReports);
router.get("/tax-reports", getTaxReports);

/* ================= EXPORT ================= */

router.get("/export/:type", exportOwnerData);

/* ================= SEARCH ================= */

router.get("/users/search", searchUsersByEmail);

export default router;
