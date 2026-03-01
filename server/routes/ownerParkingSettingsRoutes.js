// routes/ownerParkingSettingsRoutes.js
import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  updateOperatingHours,
  addHoliday,
  removeHoliday,
  updateCancellationPolicy,
} from "../controllers/parkingSettingsController.js";

const router = express.Router();

router.use(protect, authorize("owner"));

router.patch("/:id/hours", updateOperatingHours);
router.post("/:id/holidays", addHoliday);
router.delete("/:id/holidays/:holidayId", removeHoliday);
router.patch("/:id/cancellation-policy", updateCancellationPolicy);

export default router;
