const legends = [
  {
    label: "Available",
    className:
      "border-emerald-300 bg-emerald-100",
  },
  {
    label: "Occupied",
    className:
      "border-rose-300 bg-rose-100",
  },
  {
    label: "Reserved",
    className:
      "border-amber-300 bg-amber-100",
  },
  {
    label: "Maintenance",
    className:
      "border-slate-300 bg-slate-200",
  },
  {
    label: "Selected",
    className:
      "border-indigo-500 bg-indigo-500",
  },
];

export default function SeatLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {legends.map((legend) => (
        <div
          key={legend.label}
          className="flex items-center gap-2"
        >
          <span
            className={`h-3.5 w-3.5 rounded border ${legend.className}`}
          />

          <span className="text-xs font-medium text-slate-600">
            {legend.label}
          </span>
        </div>
      ))}
    </div>
  );
}