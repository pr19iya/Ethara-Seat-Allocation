export interface Employee {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  role: string;
  joining_date: string;
  status: string;

  department_id: number;
  project_id: number;
}

export interface EmployeeResponse {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}