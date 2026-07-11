"use client";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
}

export default function EmployeeToolbar({
  search,
  setSearch,
  onAdd,
}: Props) {
  return (
    <div className="flex justify-between items-center mb-6">
      <input
        type="text"
        placeholder="Search Employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-80"
      />

      <button
        onClick={onAdd}
        className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
      >
        + Add Employee
      </button>
    </div>
  );
}