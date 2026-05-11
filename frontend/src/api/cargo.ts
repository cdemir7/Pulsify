import api from "./index";

export const cargoApi = {
  getAll: (params?: { cargo_status?: string; limit?: number; skip?: number }) =>
    api.get("/api/cargo", { params }),

  getDelayed: () =>
    api.get("/api/cargo/delayed"),

  getStats: () =>
    api.get("/api/cargo/stats"),

  getAiTriage: () =>
    api.get("/api/cargo/ai-triage"),

  getAiInsight: () =>
    api.get("/api/cargo/ai-insight"),

  updateStatus: (orderId: string, body: {
    cargo_status: string;
    cargo_company?: string;
    tracking_number?: string;
  }) => api.put(`/api/cargo/${orderId}`, body),

  notify: (orderId: string) =>
    api.post(`/api/cargo/${orderId}/notify`),
};
