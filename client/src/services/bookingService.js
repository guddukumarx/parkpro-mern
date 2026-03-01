// src/services/bookingService.js
import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const bookingApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
bookingApi.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for consistent error handling
bookingApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data || error.message);
  },
);

const bookingService = {
  /**
   * Create a new booking
   * @param {Object} bookingData - { parkingId, slotId, startTime, endTime, vehicleNumber, notes, couponId, discountAmount }
   * @returns {Promise<Object>}
   */
  async createBooking(bookingData) {
    try {
      const response = await bookingApi.post("/bookings", bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch bookings for the logged-in user
   * @param {Object} params - query params like status, page, limit
   * @returns {Promise<Object>}
   */
  async fetchUserBookings(params = {}) {
    try {
      const response = await bookingApi.get("/bookings/my-bookings", {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch bookings for a specific user (admin only)
   * @param {string} userId
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async fetchUserBookingsAdmin(userId, params = {}) {
    try {
      const response = await bookingApi.get(`/bookings/user/${userId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch bookings for the logged-in owner (bookings on their parkings)
   * @param {Object} params - status, page, limit
   * @returns {Promise<Object>}
   */
  async fetchOwnerBookings(params = {}) {
    try {
      const response = await bookingApi.get("/owner/bookings", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get booking details by ID
   * @param {string} bookingId
   * @returns {Promise<Object>}
   */
  async getBookingById(bookingId) {
    try {
      const response = await bookingApi.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cancel a booking (user, owner, or admin)
   * @param {string} bookingId
   * @returns {Promise<Object>}
   */
  async cancelBooking(bookingId) {
    try {
      const response = await bookingApi.patch(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Process a refund for a booking (admin only)
   * @param {string} bookingId
   * @param {Object} refundData - { amount, reason }
   * @returns {Promise<Object>}
   */
  async refundBooking(bookingId, refundData = {}) {
    try {
      const response = await bookingApi.post(
        `/bookings/${bookingId}/refund`,
        refundData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Extend an active booking (optional feature)
   * @param {string} bookingId
   * @param {Object} extendData - { additionalMinutes }
   * @returns {Promise<Object>}
   */
  async extendBooking(bookingId, extendData) {
    try {
      const response = await bookingApi.patch(
        `/bookings/${bookingId}/extend`,
        extendData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch all bookings (admin) with filtering and pagination
   * @param {Object} params - status, dateFrom, dateTo, page, limit
   * @returns {Promise<Object>}
   */
  async fetchAllBookings(params = {}) {
    try {
      const response = await bookingApi.get("/bookings", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Validate a coupon code before applying to booking
   * @param {string} code - coupon code
   * @param {string} parkingId - ID of the parking
   * @param {number} bookingAmount - total booking amount before discount
   * @returns {Promise<Object>} - { coupon, discountAmount, finalAmount }
   */
  async validateCoupon(code, parkingId, bookingAmount) {
    try {
      const response = await bookingApi.post("/coupons/validate", {
        code,
        parkingId,
        bookingAmount,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bookingService;
