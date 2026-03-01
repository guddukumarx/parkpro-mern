// src/services/contactService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const contactApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

const contactService = {
  async sendMessage(data) {
    try {
      const response = await contactApi.post("/contact", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default contactService;
