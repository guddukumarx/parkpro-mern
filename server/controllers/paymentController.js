// // controllers/paymentController.js


// console.log('🔥 DEBUG: paymentController loaded');
// console.log('STRIPE_SECRET_KEY from env:', process.env.STRIPE_SECRET_KEY);
// import Stripe from 'stripe';
// import Booking from '../models/Booking.js';
// import { createAuditLog } from '../services/auditService.js';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // @desc    Create a payment intent for a booking
// // @route   POST /api/payments/create-intent
// // @access  Private
// export const createPaymentIntent = async (req, res) => {
//   try {
//     const { bookingId } = req.body;

//     const booking = await Booking.findById(bookingId).populate('user');
//     if (!booking) {
//       return res.status(404).json({ success: false, message: 'Booking not found' });
//     }

//     // Create payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(booking.totalPrice * 100), // in cents
//       currency: 'usd',
//       metadata: { bookingId: booking._id.toString() },
//     });

//     res.json({
//       success: true,
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Handle Stripe webhook (payment success, failure)
// // @route   POST /api/payments/webhook
// // @access  Public (Stripe calls this)
// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       const bookingId = paymentIntent.metadata.bookingId;
//       await Booking.findByIdAndUpdate(bookingId, {
//         paymentStatus: 'paid',
//         status: 'confirmed',
//       });
//       // Send email notification
//       // ... later
//       break;
//     case 'payment_intent.payment_failed':
//       // Handle failure
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// };




// controllers/paymentController.js - DISABLED
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a payment intent for a booking
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  // Temporary: skip payment, just return success
  res.json({ success: true, clientSecret: 'dummy_client_secret' });
};

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public
export const stripeWebhook = async (req, res) => {
  res.json({ received: true });
};