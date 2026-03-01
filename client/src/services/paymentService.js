// client/src/services/paymentService.js
import axios from 'axios'; // or use fetch

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const paymentService = {
  /**
   * Create a payment intent on the backend
   * @param {number} amount - Amount in smallest currency unit (e.g., cents)
   * @param {string} currency - Currency code (default: 'usd')
   * @returns {Promise<{clientSecret: string}>}
   */
  createPaymentIntent: async (amount, currency = 'usd') => {
    try {
      const response = await axios.post(`${API_URL}/payments/create-payment-intent`, {
        amount,
        currency,
      });
      return response.data; // should contain clientSecret
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  /**
   * Confirm payment after successful Stripe payment
   * @param {string} paymentIntentId - The ID of the payment intent
   * @returns {Promise<Object>}
   */
  confirmPayment: async (paymentIntentId) => {
    try {
      const response = await axios.post(`${API_URL}/payments/confirm`, {
        paymentIntentId,
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  },

  /**
   * Save booking after payment success
   * @param {Object} bookingData - Booking details
   * @returns {Promise<Object>}
   */
  saveBooking: async (bookingData) => {
    try {
      const response = await axios.post(`${API_URL}/bookings`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  },
};

export default paymentService;