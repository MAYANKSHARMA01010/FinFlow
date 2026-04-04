import api from "./axios";

export const getDashboardSummary = () => api.get("/dashboard/summary");
export const getCategoryBreakdown = () => api.get("/dashboard/category-breakdown");
export const getMonthlyTrends = () => api.get("/dashboard/monthly-trends");
export const getRecentActivity = () => api.get("/dashboard/recent-activity");
