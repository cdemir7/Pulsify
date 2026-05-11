import api from "./index";

export const dashboardApi = {
  getSummary: () =>
    api.get("/api/dashboard/summary"),
};
