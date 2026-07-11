"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import ProjectModal from "@/components/projects/ProjectModal";
import ProjectPagination from "@/components/projects/ProjectPagination";
import ProjectTable from "@/components/projects/ProjectTable";
import ProjectToolbar from "@/components/projects/ProjectToolbar";

import { Project } from "@/types/project";

import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "@/services/projectService";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects(
        page,
        limit,
        search
      );

      setProjects(data.projects ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      console.error("Project loading failed:", err);

      setError(
        "Unable to load projects. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  async function handleSave(
    data: Partial<Project>
  ) {
    if (selectedProject) {
      await updateProject(
        selectedProject.id,
        data
      );
    } else {
      await createProject(data);
    }

    setOpenModal(false);
    setSelectedProject(null);

    await loadProjects();
  }

  async function handleDelete(
    project: Project
  ) {
    const confirmed = window.confirm(
      `Delete project "${project.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteProject(project.id);
      await loadProjects();
    } catch (err) {
      console.error("Project deletion failed:", err);

      window.alert(
        "Project could not be deleted. It may still have employees or allocations linked to it."
      );
    }
  }

  return (
    <div className="page-container">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Project Management
        </h1>

        <p className="mt-1 text-slate-500">
          Create and manage Ethara projects.
        </p>
      </div>

      <ProjectToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onAdd={() => {
          setSelectedProject(null);
          setOpenModal(true);
        }}
      />

      {loading && (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          Loading projects...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}

          <button
            type="button"
            onClick={() => void loadProjects()}
            className="ml-4 rounded bg-red-600 px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        projects.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            No projects found.
          </div>
        )}

      {!loading &&
        !error &&
        projects.length > 0 && (
          <>
            <ProjectTable
              projects={projects}
              onEdit={(project) => {
                setSelectedProject(project);
                setOpenModal(true);
              }}
              onDelete={handleDelete}
            />

            <ProjectPagination
              page={page}
              total={total}
              limit={limit}
              onChange={setPage}
            />
          </>
        )}

      {openModal && (
        <ProjectModal
          key={selectedProject?.id ?? "new-project"}
          project={selectedProject}
          onClose={() => {
            setOpenModal(false);
            setSelectedProject(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}