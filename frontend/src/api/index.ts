import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "Bilinmeyen hata";
    console.error("API Hatası:", message);
    return Promise.reject(error);
  }
);

export default api;
export { cargoApi } from "./cargo";
