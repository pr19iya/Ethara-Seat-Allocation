"use client";

import { FormEvent, useState } from "react";

import { Project } from "@/types/project";

interface Props {
  project?: Project | null;
  onClose: () => void;
  onSave: (data: Partial<Project>) => Promise<void>;
}

export default function ProjectModal({
  project,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Partial<Project>>({
    name: project?.name ?? "",
    description: project?.description ?? "",
    manager_name: project?.manager_name ?? "",
    status: project?.status ?? "Planning",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!form.name?.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        name: form.name.trim(),
        manager_name: form.manager_name?.trim() || null,
        description: form.description?.trim() || null,
        status: form.status ?? "Planning",
      });
    } catch (err) {
      console.error("Project save failed:", err);

      setError(
        "Project could not be saved. Please check the backend response."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {project ? "Edit Project" : "Add Project"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the project details below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">
              Project Name
            </span>

            <input
              required
              name="name"
              value={form.name ?? ""}
              onChange={handleChange}
              placeholder="Project name"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">
              Manager Name
            </span>

            <input
              name="manager_name"
              value={form.manager_name ?? ""}
              onChange={handleChange}
              placeholder="Manager name"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">
              Description
            </span>

            <textarea
              name="description"
              value={form.description ?? ""}
              onChange={handleChange}
              rows={4}
              placeholder="Project description"
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">
              Status
            </span>

            <select
              name="status"
              value={form.status ?? "Planning"}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
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
            disabled={saving}
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : project
                ? "Update Project"
                : "Add Project"}
          </button>
        </div>
      </form>
    </div>
  );
}