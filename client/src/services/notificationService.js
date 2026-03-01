// src/services/notificationService.js
import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const notificationApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

notificationApi.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const notificationService = {
  async getNotifications(params = {}) {
    try {
      const response = await notificationApi.get('/notifications', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async markAsRead(id) {
    try {
      const response = await notificationApi.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async markAllAsRead() {
    try {
      const response = await notificationApi.patch('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteNotification(id) {
    try {
      const response = await notificationApi.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default notificationService;