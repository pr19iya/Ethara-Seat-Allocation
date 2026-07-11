"use client";

import { Seat } from "@/types/seat";

interface Props {
  seat: Seat;
  onClick?: () => void;
}

function getSeatStyle(status: Seat["status"]) {
  switch (status) {
    case "Available":
      return "border-emerald-200 bg-emerald-50 text-emerald-950";

    case "Occupied":
      return "border-rose-200 bg-rose-50 text-rose-950";

    case "Reserved":
      return "border-amber-200 bg-amber-50 text-amber-950";

    case "Maintenance":
      return "border-slate-300 bg-slate-100 text-slate-800";

    default:
      return "border-slate-200 bg-white text-slate-900";
  }
}

function getStatusBadge(status: Seat["status"]) {
  switch (status) {
    case "Available":
      return "bg-emerald-100 text-emerald-700";

    case "Occupied":
      return "bg-rose-100 text-rose-700";

    case "Reserved":
      return "bg-amber-100 text-amber-700";

    case "Maintenance":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function SeatCard({
  seat,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${getSeatStyle(
        seat.status
      )}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-mono text-base font-bold tracking-tight">
            {seat.seat_number}
          </h3>

          <p className="mt-3 text-sm font-medium">
            Floor {seat.floor}
          </p>

          <p className="mt-1 text-sm opacity-75">
            Zone {seat.zone} · Bay {seat.bay}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusBadge(
            seat.status
          )}`}
        >
          {seat.status}
        </span>
      </div>
    </button>
  );
}