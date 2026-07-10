import api from "./api";

export const getDashboardAnalytics = async () => {
  const res = await api.get("/analytics/dashboard");
  return res.data;
};