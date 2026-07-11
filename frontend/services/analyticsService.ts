import api from "@/lib/api";
import { AnalyticsData } from "@/types/analytics";
export async function getAnalytics(): Promise<AnalyticsData> {
  const response = await api.get("/analytics");
  return response.data;
}