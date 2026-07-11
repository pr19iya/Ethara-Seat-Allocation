"use client";

import {
  CheckCircle2,
  Search,
  UserRound,
  X,
} from "lucide-react";

import {
  AvailableEmployee,
  FloorSeat,
} from "@/types/allocation";

interface Props {
  seat: FloorSeat | null;
  search: string;
  employees: AvailableEmployee[];
  selectedEmployee: AvailableEmployee | null;
  searching: boolean;
  allocating: boolean;
  onSearchChange: (value: string) => void;
  onEmployeeSelect: (employee: AvailableEmployee) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AllocationDrawer({
  seat,
  search,
  employees,
  selectedEmployee,
  searching,
  allocating,
  onSearchChange,
  onEmployeeSelect,
  onClose,
  onConfirm,
}: Props) {
  if (!seat) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close allocation drawer"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[1px]"
      />

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-[430px] flex-col border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Allocate Seat
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Select an employee for this seat.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-500">
              Selected Seat
            </p>

            <p className="mt-2 text-lg font-bold text-indigo-950">
              {seat.seat_number}
            </p>

            <p className="mt-1 text-xs text-indigo-700">
              Floor {seat.floor} · Zone {seat.zone} · Bay {seat.bay}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Search employee
            </label>

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  onSearchChange(event.target.value)
                }
                placeholder="Name, code, email, department..."
                className="form-control pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            {searching && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                Searching employees...
              </div>
            )}

            {!searching &&
              employees.map((employee) => {
                const selected =
                  selectedEmployee?.id === employee.id;

                return (
                  <button
                    key={employee.id}
                    type="button"
                    onClick={() => onEmployeeSelect(employee)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                        : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          selected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <UserRound size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {employee.name}
                            </p>

                            <p className="mt-0.5 text-[11px] text-indigo-600">
                              {employee.employee_code}
                            </p>
                          </div>

                          {selected && (
                            <CheckCircle2
                              size={18}
                              className="text-indigo-600"
                            />
                          )}
                        </div>

                        <p className="mt-2 truncate text-xs text-slate-500">
                          {employee.email}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {employee.department || "No department"}
                          {" · "}
                          {employee.project || "No project"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}

            {!searching && employees.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
                <p className="text-xs font-medium text-slate-600">
                  No employees found
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 p-5">
          <button
            type="button"
            disabled={!selectedEmployee || allocating}
            onClick={onConfirm}
            className="primary-button w-full"
          >
            {allocating
              ? "Allocating..."
              : "Confirm Allocation"}
          </button>
        </div>
      </aside>
    </>
  );
}