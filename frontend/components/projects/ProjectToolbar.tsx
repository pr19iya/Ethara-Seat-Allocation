"use client";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
}

export default function ProjectToolbar({
  search,
  onSearchChange,
  onAdd,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <input
        type="text"
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Search by project or manager..."
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-md"
      />

      <button
        type="button"
        onClick={onAdd}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 font-small text-white hover:bg-blue-700"
      >
        + Add Project
      </button>
    </div>
  );
}