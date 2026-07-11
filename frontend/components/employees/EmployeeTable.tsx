"use client";

import { Employee } from "@/types/employee";

interface Props {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="table-card overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="border-t border-slate-100 transition hover:bg-indigo-50/40"
            >
              <td className="p-3">{employee.employee_code}</td>
              <td className="p-3">{employee.name}</td>
              <td className="p-3">{employee.email}</td>
              <td className="p-3">{employee.role}</td>
              <td className="p-3">{employee.status}</td>

              <td className="p-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(employee)}
                    className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(employee.id)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}