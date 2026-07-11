import { DoorOpen } from "lucide-react";

import { FloorSeat } from "@/types/allocation";

import SeatUnit from "./SeatUnit";

interface Props {
  seats: FloorSeat[];
  selectedSeat: FloorSeat | null;
  onSeatSelect: (seat: FloorSeat) => void;
}

function groupSeats(seats: FloorSeat[]) {
  const grouped: Record<
    string,
    Record<string, FloorSeat[]>
  > = {};

  for (const seat of seats) {
    const zone = seat.zone || "General";
    const bay = seat.bay || "Main";

    if (!grouped[zone]) {
      grouped[zone] = {};
    }

    if (!grouped[zone][bay]) {
      grouped[zone][bay] = [];
    }

    grouped[zone][bay].push(seat);
  }

  return grouped;
}

export default function FloorMap({
  seats,
  selectedSeat,
  onSeatSelect,
}: Props) {
  const grouped = groupSeats(seats);

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex justify-center border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-600">
          <DoorOpen size={16} />
          Main Entrance
        </div>
      </div>

      <div className="overflow-x-auto p-6">
        <div className="min-w-[900px] space-y-8">
          {Object.entries(grouped).map(
            ([zone, bays]) => (
              <section
                key={zone}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Zone {zone}
                    </h3>

                    <p className="mt-1 text-[11px] text-slate-500">
                      {Object.values(bays).reduce(
                        (total, baySeats) =>
                          total + baySeats.length,
                        0
                      )}{" "}
                      seats
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600">
                    Zone {zone}
                  </span>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {Object.entries(bays).map(
                    ([bay, baySeats]) => (
                      <div
                        key={bay}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <p className="mb-4 text-xs font-semibold text-slate-600">
                          Bay {bay}
                        </p>

                        <div className="flex flex-wrap gap-3">
                          {baySeats.map((seat) => (
                            <SeatUnit
                              key={seat.id}
                              seat={seat}
                              selected={
                                selectedSeat?.id === seat.id
                              }
                              onSelect={onSeatSelect}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            )
          )}
        </div>
      </div>
    </div>
  );
}