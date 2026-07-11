import api from "@/lib/api";
import { FilterOption } from "@/types/filter";
export const getDashboardSummary = async () => {
  const res = await api.get("/analytics");
  return res.data;
};

export const getDepartmentChart = async () => {
  const res = await api.get("/analytics/department");
  return res.data;
};

export const getProjectChart = async () => {
  const res = await api.get("/analytics/projects");
  return res.data;
};

export const getRecentJoiners = async () => {
  const res = await api.get("/analytics/recent-joiners");
  return res.data;
};
export async function getDepartments(): Promise<FilterOption[]> {
  const response = await api.get("/departments/");
  return response.data;
}