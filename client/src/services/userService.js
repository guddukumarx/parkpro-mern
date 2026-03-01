// src/services/userService.js
import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const userApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

userApi.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const userService = {
  async getProfile() {
    try {
      const response = await userApi.get("/users/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await userApi.patch("/users/profile", profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await userApi.post("/users/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteAccount() {
    try {
      const response = await userApi.delete("/users/account");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getUserById(userId) {
    try {
      const response = await userApi.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateUserRole(userId, newRole) {
    try {
      const response = await userApi.patch(`/admin/users/${userId}/role`, {
        role: newRole,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async toggleUserStatus(userId) {
    try {
      const response = await userApi.patch(
        `/admin/users/${userId}/toggle-status`,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
