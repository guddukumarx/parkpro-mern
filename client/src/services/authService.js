// src/services/authService.js
import axios from "axios";

// Vite exposes env variables via import.meta.env, prefixed with VITE_
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Token storage keys
const TOKEN_KEY = "parkpro_access_token";
const USER_KEY = "parkpro_user";

// Create axios instance
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper functions for token management
const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

// Request interceptor to add token
authApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle 401 (unauthorized)
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Token expired or invalid – clear storage and redirect to login
      setToken(null);
      setUser(null);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Authentication service object
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, role, phone? }
   * @returns {Promise<Object>} user data and token
   */
  async register(userData) {
    try {
      const response = await authApi.post("/auth/register", userData);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      return user;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} user data
   */
  async login(email, password) {
    try {
      const response = await authApi.post("/auth/login", { email, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      return user;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Logout user (clear storage and call API if needed)
   */
  async logout() {
    try {
      // Optionally call logout endpoint to invalidate refresh token
      await authApi.post("/auth/logout");
    } catch (error) {
      // Ignore errors on logout
    } finally {
      setToken(null);
      setUser(null);
    }
  },

  /**
   * Get currently logged in user from local storage
   * @returns {Object|null}
   */
  getCurrentUser() {
    return getUser();
  },

  /**
   * Check if user is authenticated (token exists)
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!getToken();
  },

  /**
   * Refresh access token using refresh token
   * @returns {Promise<string>} new access token
   */
  async refreshToken() {
    try {
      const response = await authApi.post("/auth/refresh");
      const { token } = response.data;
      setToken(token);
      return token;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Request password reset email
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    try {
      const response = await authApi.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Reset password using token
   * @param {string} token - reset token from email
   * @param {string} newPassword
   * @returns {Promise<Object>}
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await authApi.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Expose token getter for external use if needed
  getToken,
};

export default authService;
