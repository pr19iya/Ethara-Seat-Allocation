import {
  Armchair,
  BriefcaseBusiness,
  CircleAlert,
  Gauge,
  ShieldCheck,
  Sofa,
  UserRoundCheck,
  Users,
} from "lucide-react";

import { DashboardSummary } from "@/types/dashboard";

interface Props {
  data: DashboardSummary;
}

const cardStyles = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    accent: "from-blue-500 to-blue-600",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    accent: "from-violet-500 to-violet-600",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600",
    accent: "from-slate-500 to-slate-600",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600",
    accent: "from-rose-500 to-rose-600",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    accent: "from-emerald-500 to-emerald-600",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    accent: "from-amber-400 to-amber-500",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600",
    accent: "from-orange-500 to-orange-600",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600",
    accent: "from-cyan-500 to-cyan-600",
  },
};

export default function SummaryCards({
  data,
}: Props) {
  const cards = [
    {
      label: "Total Employees",
      value: data.employees,
      helper: "Registered workforce",
      icon: Users,
      theme: "blue" as const,
    },
    {
      label: "Total Projects",
      value: data.projects,
      helper: "Across all teams",
      icon: BriefcaseBusiness,
      theme: "violet" as const,
    },
    {
      label: "Total Seats",
      value: data.seats,
      helper: "Office capacity",
      icon: Sofa,
      theme: "slate" as const,
    },
    {
      label: "Occupied Seats",
      value: data.occupied,
      helper: "Currently assigned",
      icon: Armchair,
      theme: "rose" as const,
    },
    {
      label: "Available Seats",
      value: data.available,
      helper: "Ready to allocate",
      icon: UserRoundCheck,
      theme: "emerald" as const,
    },
    {
      label: "Reserved Seats",
      value: data.reserved,
      helper: "Held for joining",
      icon: ShieldCheck,
      theme: "amber" as const,
    },
    {
      label: "Pending Allocation",
      value: data.pending_joiners,
      helper: "Employees without seats",
      icon: CircleAlert,
      theme: "orange" as const,
    },
    {
      label: "Seat Utilization",
      value: `${data.utilization}%`,
      helper: "Current occupancy rate",
      icon: Gauge,
      theme: "cyan" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const style = cardStyles[card.theme];

        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.accent}`}
            />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {card.helper}
                </p>
              </div>

              <div
                className={`rounded-xl p-3 ${style.icon}`}
              >
                <Icon size={21} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}