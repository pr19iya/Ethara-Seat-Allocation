"use client";

import { useEffect, useState } from "react";

import SummaryCards from "@/components/dashboard/SummaryCards";
import DepartmentChart from "@/components/dashboard/DepartmentChart";
import ProjectChart from "@/components/dashboard/ProjectChart";
import RecentJoiners from "@/components/dashboard/RecentJoiners";

import {
  getDashboardSummary,
  getDepartmentChart,
  getProjectChart,
  getRecentJoiners,
} from "@/services/dashboardService";

import {
  DashboardSummary,
  DepartmentData,
  ProjectData,
} from "@/types/dashboard";
import { Employee } from "@/types/employee";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [joiners, setJoiners] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchDashboard() {
      try {
        const [summaryData, departmentData, projectData, joinerData] =
          await Promise.all([
            getDashboardSummary(),
            getDepartmentChart(),
            getProjectChart(),
            getRecentJoiners(),
          ]);

        if (!ignore) {
          setSummary(summaryData);
          setDepartments(departmentData);
          setProjects(projectData);
          setJoiners(joinerData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Dashboard loading failed:", error);
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-red-500 text-xl">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="page-container">
        <div>
  <h1 className="page-title">
    Dashboard Overview
  </h1>

  <p className="page-subtitle">
    Monitor employees, projects, seat availability, and utilization.
  </p>
</div>







      <SummaryCards data={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentChart data={departments} />
        <ProjectChart data={projects} />
      </div>

      <RecentJoiners employees={joiners} />
    </div>
  );
}