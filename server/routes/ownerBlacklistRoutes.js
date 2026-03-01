// routes/ownerBlacklistRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  addToBlacklist,
  removeFromBlacklist,
  getBlacklist,
} from '../controllers/blacklistController.js';

const router = express.Router();

// All routes require authentication and owner role
router.use(protect, authorize('owner'));

router.get('/:parkingId/blacklist', getBlacklist);
router.post('/:parkingId/blacklist', addToBlacklist);
router.delete('/:parkingId/blacklist/:userId', removeFromBlacklist);

export default router;