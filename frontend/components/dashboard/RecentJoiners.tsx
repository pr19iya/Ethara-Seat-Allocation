"use client";

import { Employee } from "@/types/employee";

interface Props {
  employees: Employee[];
}

export default function RecentJoiners({
  employees,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-5">

      <h3 className="text-lg font-semibold mb-4">
        Recent Joiners
      </h3>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left p-2">Code</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Role</th>
            <th className="text-left p-2">Joining Date</th>

          </tr>

        </thead>

        <tbody>

          {employees.map((employee) => (

            <tr
              key={employee.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-2">
                {employee.employee_code}
              </td>

              <td className="p-2">
                {employee.name}
              </td>

              <td className="p-2">
                {employee.role}
              </td>

              <td className="p-2">
                {employee.joining_date}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}