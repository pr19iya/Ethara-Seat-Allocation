"use client";

import { Armchair } from "lucide-react";

import { FloorSeat } from "@/types/allocation";

interface SeatUnitProps {
  seat: FloorSeat;
  selected: boolean;
  onSelect: (seat: FloorSeat) => void;
}

function getSeatClasses(
  seat: FloorSeat,
  selected: boolean
) {
  if (selected) {
    return "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200";
  }

  switch (seat.status) {
    case "Available":
      return "border-emerald-300 bg-emerald-50 text-emerald-700 hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-emerald-100 hover:shadow-md";

    case "Occupied":
      return "cursor-not-allowed border-rose-200 bg-rose-50 text-rose-500";

    case "Reserved":
      return "cursor-not-allowed border-amber-200 bg-amber-50 text-amber-600";

    case "Maintenance":
      return "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-500";

    default:
      return "border-slate-200 bg-white text-slate-600";
  }
}

export default function SeatUnit({
  seat,
  selected,
  onSelect,
}: SeatUnitProps) {
  const selectable =
    seat.status === "Available";

  return (
    <div className="group relative">
      <button
        type="button"
        disabled={!selectable}
        onClick={() => onSelect(seat)}
        className={`flex h-[66px] w-[72px] flex-col items-center justify-center rounded-xl border text-center transition ${getSeatClasses(
          seat,
          selected
        )}`}
      >
        <Armchair
          size={21}
          strokeWidth={1.8}
        />

        <span className="mt-1 max-w-[62px] truncate text-[10px] font-semibold">
          {seat.seat_number}
        </span>
      </button>

      <div className="pointer-events-none absolute bottom-[76px] left-1/2 z-40 hidden w-64 -translate-x-1/2 rounded-xl border border-slate-200 bg-slate-900 p-3 text-left text-white shadow-xl group-hover:block">
        <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-slate-900" />

        <p className="text-xs font-semibold">
          {seat.seat_number}
        </p>

        <p className="mt-1 text-[11px] text-slate-300">
          Floor {seat.floor} · Zone {seat.zone} ·
          Bay {seat.bay}
        </p>

        <div className="mt-2 border-t border-white/10 pt-2">
          <p className="text-[11px] font-medium">
            Status: {seat.status}
          </p>

          {seat.employee && (
            <div className="mt-2 space-y-1 text-[11px] text-slate-300">
              <p className="font-medium text-white">
                {seat.employee.name}
              </p>

              <p>
                {seat.employee.employee_code}
              </p>

              <p>{seat.employee.email}</p>

              {seat.employee.department && (
                <p>
                  Department:{" "}
                  {seat.employee.department}
                </p>
              )}

              {seat.employee.project && (
                <p>
                  Project: {seat.employee.project}
                </p>
              )}
            </div>
          )}

          {seat.status === "Reserved" && (
            <p className="mt-2 text-[11px] text-amber-300">
              This seat is currently reserved.
            </p>
          )}

          {seat.status === "Maintenance" && (
            <p className="mt-2 text-[11px] text-slate-300">
              This seat is unavailable due to
              maintenance.
            </p>
          )}

          {seat.status === "Available" && (
            <p className="mt-2 text-[11px] text-emerald-300">
              Click to select this seat.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}