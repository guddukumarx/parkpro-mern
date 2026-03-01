// import express from 'express';
// import { protect } from '../middleware/auth.js';
// import { createPaymentIntent, stripeWebhook } from '../controllers/paymentController.js';

// const router = express.Router();

// router.post('/create-intent', protect, createPaymentIntent);
// router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// export default router;





import express from 'express';
import { protect } from '../middleware/auth.js';
import { createPaymentIntent, stripeWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// Temporary: accept any request
router.post('/create-intent', protect, (req, res) => {
  res.json({ success: true, clientSecret: 'dummy_client_secret' });
});

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  res.json({ received: true });
});

export default router;