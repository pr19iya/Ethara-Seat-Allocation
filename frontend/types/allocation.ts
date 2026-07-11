export type AllocationSeatStatus =
  | "Available"
  | "Occupied"
  | "Reserved"
  | "Maintenance";

export interface AllocatedEmployee {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  role: string | null;
  department: string | null;
  project: string | null;
}

export interface FloorSeat {
  id: number;
  floor: number;
  zone: string;
  bay: string;
  seat_number: string;
  status: AllocationSeatStatus;
  employee: AllocatedEmployee | null;
}

export interface FloorSummary {
  floor: number;
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  maintenance: number;
}

export interface AvailableEmployee {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  role: string | null;
  department_id: number | null;
  department: string | null;
  project_id: number | null;
  project: string | null;
  joining_date: string | null;
}

export interface AllocationPayload {
  employee_id: number;
  seat_id: number;
  project_id: number | null;
}

export interface AllocationResponse {
  message: string;
}