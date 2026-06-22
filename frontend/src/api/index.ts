import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
});

import { useAuthStore } from '../store/useAuthStore';

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.detail ||
      error.message ||
      "Bilinmeyen hata";
    console.error("API Hatası:", message);
    return Promise.reject(error);
  }
);

export default api;
export { cargoApi } from "./cargo";
