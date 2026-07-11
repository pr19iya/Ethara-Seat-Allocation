import api from "@/lib/api";

export interface Department {
  id: number;
  name: string;
}

export async function getDepartments(): Promise<Department[]> {
  const response = await api.get("/departments");

  return response.data;
}