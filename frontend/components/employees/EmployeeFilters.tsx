"use client";

import { FilterOption } from "@/types/filter";
import { Project } from "@/types/project";

interface Props {
  departments: FilterOption[];
  projects: Project[];

  departmentId: number | undefined;
  projectId: number | undefined;
  status: string;

  onDepartmentChange: (value: number | undefined) => void;
  onProjectChange: (value: number | undefined) => void;
  onStatusChange: (value: string) => void;
}

export default function EmployeeFilters({
  departments,
  projects,
  departmentId,
  projectId,
  status,
  onDepartmentChange,
  onProjectChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      <select
        value={departmentId ?? ""}
        onChange={(event) =>
          onDepartmentChange(
            event.target.value
              ? Number(event.target.value)
              : undefined
          )
        }
        className="min-w-44 rounded-lg border border-slate-300 bg-white px-4 py-2.5"
      >
        <option value="">All Departments</option>

        {departments.map((department) => (
          <option
            key={department.id}
            value={department.id}
          >
            {department.name}
          </option>
        ))}
      </select>

      <select
        value={projectId ?? ""}
        onChange={(event) =>
          onProjectChange(
            event.target.value
              ? Number(event.target.value)
              : undefined
          )
        }
        className="min-w-44 rounded-lg border border-slate-300 bg-white px-4 py-2.5"
      >
        <option value="">All Projects</option>

        {projects.map((project) => (
          <option
            key={project.id}
            value={project.id}
          >
            {project.name}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
        className="min-w-36 rounded-lg border border-slate-300 bg-white px-4 py-2.5"
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="On Leave">On Leave</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}