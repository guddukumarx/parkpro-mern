import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const staffApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

staffApi.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const staffService = {
  async getDashboard() {
    try {
      const response = await staffApi.get('/staff/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getParkingSlots(parkingId) {
    try {
      const response = await staffApi.get(`/staff/parkings/${parkingId}/slots`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updateSlotStatus(slotId, status) {
    try {
      const response = await staffApi.patch(`/staff/slots/${slotId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default staffService;