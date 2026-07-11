"use client";

import { useCallback, useEffect, useState } from "react";

import EmployeeToolbar from "@/components/employees/EmployeeToolbar";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import EmployeeTable from "@/components/employees/EmployeeTable";
import EmployeePagination from "@/components/employees/EmployeePagination";
import EmployeeModal from "@/components/employees/EmployeeModal";

import { Employee } from "@/types/employee";
import { FilterOption } from "@/types/filter";
import { Project } from "@/types/project";

import  {getDepartments}  from "@/services/departmentService";
import { getProjects } from "@/services/projectService";

import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "@/services/employeeService";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [departments, setDepartments] = useState<FilterOption[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [departmentId, setDepartmentId] =
    useState<number | undefined>(undefined);

  const [projectId, setProjectId] =
    useState<number | undefined>(undefined);

  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const limit = 20;

  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEmployees(
        page,
        limit,
        search,
        departmentId,
        projectId,
        status
      );

      setEmployees(data.employees ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      console.error("Failed to load employees:", err);

      setEmployees([]);
      setTotal(0);

      setError(
        "Unable to load employees. Check that the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, [
    page,
    search,
    departmentId,
    projectId,
    status,
  ]);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    let cancelled = false;

    async function loadFilterOptions() {
      try {
        setFiltersLoading(true);

        const [departmentData, projectData] =
          await Promise.all([
            getDepartments(),
            getProjects(1, 100),
          ]);

        if (!cancelled) {
          setDepartments(departmentData ?? []);
          setProjects(projectData.projects ?? []);
        }
      } catch (err) {
        console.error(
          "Failed to load employee filters:",
          err
        );

        if (!cancelled) {
          setDepartments([]);
          setProjects([]);
        }
      } finally {
        if (!cancelled) {
          setFiltersLoading(false);
        }
      }
    }

    void loadFilterOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(data: Partial<Employee>) {
    try {
      if (selectedEmployee) {
        await updateEmployee(
          selectedEmployee.id,
          data
        );
      } else {
        await createEmployee(data);
      }

      setOpenModal(false);
      setSelectedEmployee(null);

      await loadEmployees();
    } catch (err) {
      console.error("Employee save failed:", err);
      window.alert("Employee could not be saved.");
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this employee?"
    );

    if (!confirmed) return;

    try {
      await deleteEmployee(id);
      await loadEmployees();
    } catch (err) {
      console.error("Employee delete failed:", err);
      window.alert("Employee could not be deleted.");
    }
  }

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">
          Employee Management
        </h1>

        <p className="mt-1 text-slate-500">
          Search, add, edit and manage Ethara employees.
        </p>
      </div>

      <EmployeeToolbar
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onAdd={() => {
          setSelectedEmployee(null);
          setOpenModal(true);
        }}
      />

      {filtersLoading ? (
        <div className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-sm">
          Loading filters...
        </div>
      ) : (
        <EmployeeFilters
          departments={departments}
          projects={projects}
          departmentId={departmentId}
          projectId={projectId}
          status={status}
          onDepartmentChange={(value) => {
            setDepartmentId(value);
            setPage(1);
          }}
          onProjectChange={(value) => {
            setProjectId(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />
      )}

      {loading && (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          Loading employees...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => void loadEmployees()}
            className="ml-4 rounded bg-red-600 px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && employees.length === 0 && (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          No employees match the selected filters.
        </div>
      )}

      {!loading && !error && employees.length > 0 && (
        <>
          <EmployeeTable
            employees={employees}
            onEdit={(employee) => {
              setSelectedEmployee(employee);
              setOpenModal(true);
            }}
            onDelete={handleDelete}
          />

          <EmployeePagination
            page={page}
            total={total}
            limit={limit}
            onChange={setPage}
          />
        </>
      )}

      {openModal && (
        <EmployeeModal
          key={selectedEmployee?.id ?? "new-employee"}
    employee={selectedEmployee}
    departments={departments}
    projects={projects}
    onClose={() => {
      setOpenModal(false);
      setSelectedEmployee(null);
    }}
    onSave={handleSave}
        />
      )}
    </div>
  );
}