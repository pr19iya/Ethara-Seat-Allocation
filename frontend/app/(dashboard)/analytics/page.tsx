"use client";

import { useEffect, useState } from "react";

import { getAnalytics } from "@/services/analyticsService";
import { AnalyticsData } from "@/types/analytics";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      try {
        const response = await getAnalytics();

        if (!cancelled) {
          setData(response);
        }
      } catch (err) {
        console.error("Analytics loading failed:", err);

        if (!cancelled) {
          setError("Unable to load analytics.");
        }
      }
    }

    void loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        Loading analytics...
      </div>
    );
  }

  const cards = [
    { label: "Total Employees", value: data.employees },
    { label: "Total Projects", value: data.projects },
    { label: "Total Seats", value: data.seats },
    { label: "Occupied Seats", value: data.occupied },
    { label: "Available Seats", value: data.available },
    { label: "Reserved Seats", value: data.reserved },
    { label: "Pending Allocation", value: data.pending_joiners },
    { label: "Seat Utilization", value: `${data.utilization}%` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Analytics Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Live statistics for employees, projects and seat utilization.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {card.label}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}