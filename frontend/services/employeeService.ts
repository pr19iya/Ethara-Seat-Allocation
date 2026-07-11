import api from "@/lib/api";
import { EmployeeResponse, Employee } from "@/types/employee";

// ===============================
// Get Employees
// ===============================
export async function getEmployees(
  page = 1,
  limit = 20,
  search = "",
  department_id?: number,
  project_id?: number,
  status?: string
): Promise<EmployeeResponse> {
  const params = new URLSearchParams();

  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search) {
    params.append("search", search);
  }

  if (department_id) {
    params.append("department_id", department_id.toString());
  }

  if (project_id) {
    params.append("project_id", project_id.toString());
  }

  if (status) {
    params.append("status", status);
  }

  const response = await api.get(`/employees?${params.toString()}`);

  return response.data;
}

// ===============================
// Create Employee
// ===============================
export async function createEmployee(
  employee: Partial<Employee>
): Promise<Employee> {
  const response = await api.post("/employees/", employee);

  return response.data;
}

// ===============================
// Update Employee
// ===============================
export async function updateEmployee(
  id: number,
  employee: Partial<Employee>
): Promise<Employee> {
  const response = await api.put(`/employees/${id}`, employee);

  return response.data;
}

// ===============================
// Delete Employee
// ===============================
export async function deleteEmployee(
  id: number
): Promise<void> {
  await api.delete(`/employees/${id}`);
}