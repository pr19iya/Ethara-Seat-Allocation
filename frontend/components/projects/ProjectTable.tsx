"use client";

import { Project } from "@/types/project";

interface Props {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectTable({
  projects,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Project
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Manager
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Description
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Status
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="border-t border-slate-200 hover:bg-slate-50"
            >
              <td className="px-4 py-3 font-medium text-slate-900">
                {project.name}
              </td>

              <td className="px-4 py-3 text-slate-700">
                {project.manager_name || "Not assigned"}
              </td>

              <td className="max-w-md px-4 py-3 text-slate-600">
                {project.description || "No description"}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    project.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : project.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {project.status}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(project)}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
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