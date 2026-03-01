// src/services/adminService.js
import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
adminApi.interceptors.request.use(
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
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return a standardized error object
    return Promise.reject(error.response?.data || { message: error.message });
  },
);

const adminService = {
  // ========== Dashboard ==========
  async getDashboardStats(params = {}) {
    const response = await adminApi.get("/admin/dashboard/stats", { params });
    return response.data;
  },

  // ========== Reports ==========
  async getPlatformReports(params = {}) {
    const response = await adminApi.get("/admin/reports", { params });
    return response.data;
  },

  // ========== Users ==========
  async getAllUsers(params = {}) {
    const response = await adminApi.get("/admin/users", { params });
    return response.data;
  },

  async getUserById(userId) {
    const response = await adminApi.get(`/admin/users/${userId}`);
    return response.data;
  },

  async updateUserRole(userId, role) {
    const response = await adminApi.patch(`/admin/users/${userId}/role`, {
      role,
    });
    return response.data;
  },

  async toggleUserStatus(userId) {
    const response = await adminApi.patch(
      `/admin/users/${userId}/toggle-status`,
    );
    return response.data;
  },

  // ========== Parkings ==========
  async getAllParkings(params = {}) {
    const response = await adminApi.get("/admin/parkings", { params });
    return response.data;
  },

  async getParkingById(parkingId) {
    const response = await adminApi.get(`/admin/parkings/${parkingId}`);
    return response.data;
  },

  async updateParkingAdmin(parkingId, data) {
    const response = await adminApi.put(`/admin/parkings/${parkingId}`, data);
    return response.data;
  },

  async deleteParkingAdmin(parkingId) {
    const response = await adminApi.delete(`/admin/parkings/${parkingId}`);
    return response.data;
  },

  // ========== Bookings ==========
  /**
   * Get all bookings with optional filters.
   * @param {Object} params - Query parameters
   * @param {string} params.status - Payment status (paid, pending, failed, refunded, etc.)
   * @param {string} params.paymentMethod - Payment method (card, cash, etc.)
   * @param {string} params.dateFrom - Start date (YYYY-MM-DD)
   * @param {string} params.dateTo - End date (YYYY-MM-DD)
   * @param {number} params.page - Page number (1-indexed)
   * @param {number} params.limit - Items per page
   * @param {string} params.sortBy - Field to sort by
   * @param {string} params.sortOrder - 'asc' or 'desc'
   */
  async getAllBookings(params = {}) {
    const response = await adminApi.get("/admin/bookings", { params });
    return response.data;
  },

  async getBookingById(bookingId) {
    const response = await adminApi.get(`/admin/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Update payment status of a booking.
   * @param {string} bookingId
   * @param {string} newStatus - New payment status
   * @param {string} reason - Optional reason for status change
   */
  async updatePaymentStatus(bookingId, newStatus, reason = "") {
    const response = await adminApi.patch(
      `/admin/bookings/${bookingId}/payment-status`,
      { status: newStatus, reason },
    );
    return response.data;
  },

  /**
   * Issue a refund for a booking.
   * @param {string} bookingId
   * @param {Object} refundData
   * @param {number} refundData.amount - Amount to refund (full or partial)
   * @param {string} refundData.reason - Reason for refund
   */
  async refundBooking(bookingId, refundData = {}) {
    const response = await adminApi.post(
      `/admin/bookings/${bookingId}/refund`,
      refundData,
    );
    return response.data;
  },

  /**
   * Alias for refundBooking, used in AdminPayments.
   * @param {string} bookingId
   * @param {Object} options
   * @param {number} options.amount - Refund amount
   * @param {string} options.reason - Reason
   */
  async issueRefund(bookingId, { amount, reason } = {}) {
    return this.refundBooking(bookingId, { amount, reason });
  },

  // ========== Owner Approvals ==========
  async getPendingOwners() {
    const response = await adminApi.get("/admin/owners/pending");
    return response.data;
  },

  async approveOwner(ownerId) {
    const response = await adminApi.post(`/admin/owners/${ownerId}/approve`);
    return response.data;
  },

  async rejectOwner(ownerId, reason = "") {
    const response = await adminApi.post(`/admin/owners/${ownerId}/reject`, {
      reason,
    });
    return response.data;
  },

  // ========== Settings ==========
  async getSettings() {
    const response = await adminApi.get("/admin/settings");
    return response.data;
  },

  async updateSettings(settings) {
    const response = await adminApi.patch("/admin/settings", settings);
    return response.data;
  },

  // ========== Logs ==========
  async getLogs(params = {}) {
    const response = await adminApi.get("/admin/logs", { params });
    return response.data;
  },

  // ========== Audit Logs ==========
  async getAuditLogs(params = {}) {
    const response = await adminApi.get("/admin/audit-logs", { params });
    return response.data;
  },

  // ========== Coupons ==========
  async createCoupon(data) {
    const response = await adminApi.post("/admin/coupons", data);
    return response.data;
  },

  async getAllCoupons(params = {}) {
    const response = await adminApi.get("/admin/coupons", { params });
    return response.data;
  },

  async getCouponById(id) {
    const response = await adminApi.get(`/admin/coupons/${id}`);
    return response.data;
  },

  async updateCoupon(id, data) {
    const response = await adminApi.put(`/admin/coupons/${id}`, data);
    return response.data;
  },

  async deleteCoupon(id) {
    const response = await adminApi.delete(`/admin/coupons/${id}`);
    return response.data;
  },

  // ========== Payouts ==========
  async getPayouts(params = {}) {
    const response = await adminApi.get("/admin/payouts", { params });
    return response.data;
  },

  async getPayoutById(payoutId) {
    const response = await adminApi.get(`/admin/payouts/${payoutId}`);
    return response.data;
  },

  async updatePayoutStatus(payoutId, status) {
    const response = await adminApi.patch(`/admin/payouts/${payoutId}/status`, {
      status,
    });
    return response.data;
  },

  // ========== Maintenance ==========
  async getAllMaintenanceRequests(params = {}) {
    const response = await adminApi.get("/admin/maintenance", { params });
    return response.data;
  },

  async getMaintenanceRequestById(requestId) {
    const response = await adminApi.get(`/admin/maintenance/${requestId}`);
    return response.data;
  },

  async updateMaintenanceRequest(requestId, data) {
    const response = await adminApi.patch(
      `/admin/maintenance/${requestId}`,
      data,
    );
    return response.data;
  },

  async deleteMaintenanceRequest(requestId) {
    const response = await adminApi.delete(`/admin/maintenance/${requestId}`);
    return response.data;
  },

  // ========== Blacklist (global) ==========
  async getAllBlacklist(params = {}) {
    const response = await adminApi.get("/admin/blacklist", { params });
    return response.data;
  },

  async removeFromBlacklist(entryId) {
    const response = await adminApi.delete(`/admin/blacklist/${entryId}`);
    return response.data;
  },

  // ========== Notifications (bulk) ==========
  async sendNotification(data) {
    const response = await adminApi.post("/admin/notifications/send", data);
    return response.data;
  },

  async getNotificationHistory(params = {}) {
    const response = await adminApi.get("/admin/notifications", { params });
    return response.data;
  },

  // ========== Email Templates ==========
  async getEmailTemplates() {
    const response = await adminApi.get("/admin/email-templates");
    return response.data;
  },

  async getEmailTemplateByName(name) {
    const response = await adminApi.get(`/admin/email-templates/${name}`);
    return response.data;
  },

  async createEmailTemplate(name, data) {
    const response = await adminApi.post("/admin/email-templates", {
      name,
      ...data,
    });
    return response.data;
  },

  async updateEmailTemplate(name, data) {
    const response = await adminApi.put(`/admin/email-templates/${name}`, data);
    return response.data;
  },

  async deleteEmailTemplate(name) {
    const response = await adminApi.delete(`/admin/email-templates/${name}`);
    return response.data;
  },

  // ========== Data Export ==========
  async exportData(type, format) {
    const response = await adminApi.get(`/admin/export/${type}`, {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },

  // ========== System Health / Info ==========
  async getSystemHealth() {
    const response = await adminApi.get("/admin/health");
    return response.data;
  },

  // ========== Admin Profile ==========
  async getAdminProfile() {
    const response = await adminApi.get("/admin/profile");
    return response.data;
  },

  async updateAdminProfile(data) {
    const response = await adminApi.patch("/admin/profile", data);
    return response.data;
  },

  // ========== Admin Change Password ==========
  async changePassword(currentPassword, newPassword) {
    const response = await adminApi.post("/admin/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default adminService;
