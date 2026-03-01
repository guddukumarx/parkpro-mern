// src/services/ownerService.js
import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ownerApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

ownerApi.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

const ownerService = {
  // ========== Parkings ==========
  async getParkings() {
    try {
      const response = await ownerApi.get("/owner/parkings");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getParkingById(id) {
    try {
      const response = await ownerApi.get(`/owner/parkings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async createParking(data) {
    try {
      const response = await ownerApi.post("/owner/parkings", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updateParking(id, data) {
    try {
      const response = await ownerApi.put(`/owner/parkings/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteParking(id) {
    try {
      const response = await ownerApi.delete(`/owner/parkings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Slots ==========
  async getSlotsByParking(parkingId) {
    try {
      const response = await ownerApi.get(`/owner/parkings/${parkingId}/slots`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async addSlot(parkingId, data) {
    try {
      const response = await ownerApi.post(
        `/owner/parkings/${parkingId}/slots`,
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updateSlot(slotId, data) {
    try {
      const response = await ownerApi.put(`/owner/slots/${slotId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteSlot(slotId) {
    try {
      const response = await ownerApi.delete(`/owner/slots/${slotId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Blacklist ==========
  async getBlacklist(parkingId, options = {}) {
    try {
      const response = await ownerApi.get(
        `/owner/parkings/${parkingId}/blacklist`,
        {
          signal: options.signal, 
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async addToBlacklist(parkingId, userId, reason) {
    try {
      const response = await ownerApi.post(
        `/owner/parkings/${parkingId}/blacklist`,
        {
          userId,
          reason,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async removeFromBlacklist(parkingId, userId) {
    try {
      const response = await ownerApi.delete(
        `/owner/parkings/${parkingId}/blacklist/${userId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Parking Settings ==========
  async updateOperatingHours(parkingId, operatingHours) {
    try {
      const response = await ownerApi.patch(
        `/owner/parkings/${parkingId}/hours`,
        {
          operatingHours,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async addHoliday(parkingId, date, reason) {
    try {
      const response = await ownerApi.post(
        `/owner/parkings/${parkingId}/holidays`,
        {
          date,
          reason,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async removeHoliday(parkingId, holidayId) {
    try {
      const response = await ownerApi.delete(
        `/owner/parkings/${parkingId}/holidays/${holidayId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updateCancellationPolicy(parkingId, cancellationPolicy) {
    try {
      const response = await ownerApi.patch(
        `/owner/parkings/${parkingId}/cancellation-policy`,
        { cancellationPolicy },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Peak Pricing ==========
  async getPricingRules(parkingId) {
    try {
      const response = await ownerApi.get(
        `/owner/parkings/${parkingId}/pricing`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async createPricingRule(parkingId, data) {
    try {
      const response = await ownerApi.post(
        `/owner/parkings/${parkingId}/pricing`,
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updatePricingRule(parkingId, ruleId, data) {
    try {
      const response = await ownerApi.put(
        `/owner/parkings/${parkingId}/pricing/${ruleId}`,
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async deletePricingRule(parkingId, ruleId) {
    try {
      const response = await ownerApi.delete(
        `/owner/parkings/${parkingId}/pricing/${ruleId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Bookings ==========
  async getOwnerBookings(params = {}) {
    try {
      const response = await ownerApi.get("/owner/bookings", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Earnings ==========
  async getOwnerEarnings(period = "month") {
    try {
      const response = await ownerApi.get("/owner/earnings", {
        params: { period },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  async getEarnings() {
    try {
      const result = await this.getOwnerEarnings();
      // Handle multiple possible response shapes
      let availableBalance = 0;
      if (result.data?.availableBalance !== undefined) {
        availableBalance = result.data.availableBalance;
      } else if (result.availableBalance !== undefined) {
        availableBalance = result.availableBalance;
      } else if (result.balance !== undefined) {
        availableBalance = result.balance;
      } else if (result.data?.balance !== undefined) {
        availableBalance = result.data.balance;
      }
      return {
        data: { availableBalance },
      };
    } catch (error) {
      console.error("getEarnings error:", error);
      throw error;
    }
  },

  // ========== Reports ==========
  async getBookingReports(params = {}) {
    try {
      const response = await ownerApi.get("/owner/reports/bookings", {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getRevenueReports(params = {}) {
    try {
      const response = await ownerApi.get("/owner/reports/revenue", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Staff ==========
  async getStaff() {
    try {
      const response = await ownerApi.get("/owner/staff");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async createStaff(data) {
    try {
      const response = await ownerApi.post("/owner/staff", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updateStaff(assignmentId, data) {
    try {
      const response = await ownerApi.put(`/owner/staff/${assignmentId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteStaff(assignmentId) {
    try {
      const response = await ownerApi.delete(`/owner/staff/${assignmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Maintenance ==========
  async getMaintenanceRequests(params = {}) {
    try {
      const response = await ownerApi.get("/owner/maintenance", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async createMaintenanceRequest(data) {
    try {
      const response = await ownerApi.post("/owner/maintenance", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updateMaintenanceRequest(id, data) {
    try {
      const response = await ownerApi.patch(`/owner/maintenance/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteMaintenanceRequest(id) {
    try {
      const response = await ownerApi.delete(`/owner/maintenance/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Payouts ==========
  async getPayouts(params = {}) {
    try {
      const response = await ownerApi.get("/owner/payouts", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async requestPayout(data) {
    try {
      const response = await ownerApi.post("/owner/payouts", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async cancelPayout(payoutId) {
    try {
      
      const response = await ownerApi.put(
        `/owner/payouts/${payoutId}/cancel`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Coupons ==========
  async getCoupons() {
    try {
      const response = await ownerApi.get("/owner/coupons");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async createCoupon(data) {
    try {
      const response = await ownerApi.post("/owner/coupons", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updateCoupon(id, data) {
    try {
      const response = await ownerApi.put(`/owner/coupons/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteCoupon(id) {
    try {
      const response = await ownerApi.delete(`/owner/coupons/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Tax Reports ==========
  async getTaxReports(params = {}) {
    try {
      const response = await ownerApi.get("/owner/tax-reports", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Export ==========
  async exportData(type, format) {
    try {
      const response = await ownerApi.get(`/owner/export/${type}`, {
        params: { format },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== Search Users (for blacklist) ==========
  async searchUsers(email) {
    try {
      const response = await ownerApi.get("/owner/users/search", {
        params: { email },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ownerService;
