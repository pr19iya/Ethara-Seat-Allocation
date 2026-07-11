export interface DepartmentAnalytics {
  name: string;
  count: number;
}

export interface AnalyticsData {
   employees: number;
  projects: number;
  seats: number;
  occupied: number;
  available: number;
  reserved: number;
  maintenance: number;
  pending_joiners: number;
  utilization: number;
}