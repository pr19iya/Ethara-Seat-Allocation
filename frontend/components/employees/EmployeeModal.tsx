"use client";

import { FormEvent, useState } from "react";

import { Employee } from "@/types/employee";
import { FilterOption } from "@/types/filter";
import { Project } from "@/types/project";

interface Props {
  employee?: Employee | null;
  departments: FilterOption[];
  projects: Project[];
  onClose: () => void;
  onSave: (data: Partial<Employee>) => Promise<void>;
}

export default function EmployeeModal({
  employee,
  departments,
  projects,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Partial<Employee>>({
    employee_code: employee?.employee_code ?? "",
    name: employee?.name ?? "",
    email: employee?.email ?? "",
    role: employee?.role ?? "",
    joining_date:
      employee?.joining_date ??
      new Date().toISOString().slice(0, 10),
    status: employee?.status ?? "Active",
    department_id:
      employee?.department_id ??
      departments[0]?.id ??
      0,
    project_id:
      employee?.project_id ??
      projects[0]?.id ??
      0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "department_id" ||
        name === "project_id"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (
      !form.employee_code?.trim() ||
      !form.name?.trim() ||
      !form.email?.trim() ||
      !form.role?.trim() ||
      !form.joining_date ||
      !form.department_id ||
      !form.project_id
    ) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setSaving(true);
      await onSave(form);
    } catch (err) {
      console.error("Employee submission failed:", err);
      setError(
        "Employee could not be saved. The email or employee code may already exist."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {employee ? "Edit Employee" : "Add Employee"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the employee details below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">
              Employee Code
            </span>

            <input
              required
              name="employee_code"
              value={form.employee_code ?? ""}
              onChange={handleChange}
              placeholder="EMP05001"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">
              Employee Name
            </span>

            <input
              required
              name="name"
              value={form.name ?? ""}
              onChange={handleChange}
              placeholder="Employee name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">
              Email
            </span>

            <input
              required
              type="email"
              name="email"
              value={form.email ?? ""}
              onChange={handleChange}
              placeholder="employee@ethara.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">
              Role
            </span>

            <input
              required
              name="role"
              value={form.role ?? ""}
              onChange={handleChange}
              placeholder="Software Engineer"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">
              Joining Date
            </span>

            <input
              required
              type="date"
              name="joining_date"
              value={form.joining_date ?? ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">
              Department
            </span>

            <select
              required
              name="department_id"
              value={form.department_id ?? 0}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            >
              <option value={0}>
                Select Department
              </option>

              {departments.map((department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">
              Project
            </span>

            <select
              required
              name="project_id"
              value={form.project_id ?? 0}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            >
              <option value={0}>Select Project</option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">
              Employment Status
            </span>

            <select
              name="status"
              value={form.status ?? "Active"}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-5 py-2.5"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : employee
                ? "Update Employee"
                : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}