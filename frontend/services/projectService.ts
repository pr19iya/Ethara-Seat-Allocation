import api from "@/lib/api";

import {
  Project,
  ProjectResponse,
} from "@/types/project";

export async function getProjects(
  page = 1,
  limit = 20,
  search = ""
): Promise<ProjectResponse> {
  const response = await api.get("/projects/", {
    params: {
      page,
      limit,
      search: search || undefined,
    },
  });

  return response.data;
}

export async function createProject(
  project: Partial<Project>
): Promise<Project> {
  const response = await api.post(
    "/projects/",
    project
  );

  return response.data;
}

export async function updateProject(
  id: number,
  project: Partial<Project>
): Promise<Project> {
  const response = await api.put(
    `/projects/${id}`,
    project
  );

  return response.data;
}

export async function deleteProject(
  id: number
): Promise<void> {
  await api.delete(`/projects/${id}`);
}