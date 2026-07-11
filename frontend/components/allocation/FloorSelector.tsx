import { Building2 } from "lucide-react";

import { FloorSummary } from "@/types/allocation";

interface Props {
  floors: FloorSummary[];
  selectedFloor: number | null;
  onSelect: (floor: number) => void;
}

export default function FloorSelector({
  floors,
  selectedFloor,
  onSelect,
}: Props) {
  return (
    <div className="surface-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
          <Building2 size={18} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Select Floor
          </h2>

          <p className="text-xs text-slate-500">
            Choose a floor to view its seat layout.
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {floors.map((floor) => {
          const active = selectedFloor === floor.floor;

          return (
            <button
              key={floor.floor}
              type="button"
              onClick={() => onSelect(floor.floor)}
              className={`min-w-[140px] rounded-xl border px-4 py-3 text-left transition ${
                active
                  ? "border-indigo-600 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <p className="text-sm font-semibold">
                Floor {floor.floor}
              </p>

              <p
                className={`mt-1 text-[11px] ${
                  active
                    ? "text-indigo-100"
                    : "text-emerald-600"
                }`}
              >
                {floor.available} available
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}