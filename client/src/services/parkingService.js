// src/services/parkingService.js
import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const parkingApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

parkingApi.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

const parkingService = {
  // Public endpoints
  async getAllParkings(params = {}) {
    try {
      const response = await parkingApi.get("/parkings", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getParkingById(parkingId) {
    try {
      // ✅ Use template literal with actual ID
      const response = await parkingApi.get(`/parkings/${parkingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async checkSlotAvailability(parkingId, params = {}) {
    try {
      const response = await parkingApi.get(
        `/parkings/${parkingId}/slots/availability`,
        { params },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Owner endpoints
  async getOwnerParkings() {
    try {
      const response = await parkingApi.get("/owner/parkings");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createParking(data) {
    try {
      const response = await parkingApi.post("/owner/parkings", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateParking(parkingId, data) {
    try {
      const response = await parkingApi.put(
        `/owner/parkings/${parkingId}`,
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteParking(parkingId) {
    try {
      const response = await parkingApi.delete(`/owner/parkings/${parkingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Fixed getSlotsByParking to prevent 404
  async getSlotsByParking(parkingId) {
    try {
      const token = authService.getToken();
      const response = await axios.get(
        `${API_URL}/owner/parkings/${parkingId}/slots`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch slots:", error.message);
      throw error;
    }
  },

  async addSlot(parkingId, slotData) {
    try {
      const response = await parkingApi.post(
        `/owner/parkings/${parkingId}/slots`,
        slotData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateSlot(slotId, slotData) {
    try {
      const response = await parkingApi.put(`/owner/slots/${slotId}`, slotData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteSlot(slotId) {
    try {
      const response = await parkingApi.delete(`/owner/slots/${slotId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin endpoints
  async getAllParkingsAdmin(params = {}) {
    try {
      const response = await parkingApi.get("/admin/parkings", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateParkingAdmin(parkingId, data) {
    try {
      const response = await parkingApi.put(
        `/admin/parkings/${parkingId}`,
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteParkingAdmin(parkingId) {
    try {
      const response = await parkingApi.delete(`/admin/parkings/${parkingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default parkingService;
