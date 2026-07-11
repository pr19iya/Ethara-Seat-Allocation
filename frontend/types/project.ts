export interface Project {
  id: number;
  name: string;
  description: string | null;
  manager_name: string | null;
  status: string;
}

export interface ProjectResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}