export interface DashboardSummary {
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

export interface DepartmentData {
  department: string;
  count: number;
}

export interface ProjectData {
  project: string;
  count: number;
}

export interface RecentJoiner {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  role: string;
  joining_date: string;
}

export interface ChartItem {
  name: string;
  value: number;
}
export interface FloorUtilization {
  floor: number;
  total: number;
  occupied: number;
  available: number;
  utilization: number;
}
export interface ProjectUtilization {
  project_id: number;
  project: string;
  allocated_seats: number;
}