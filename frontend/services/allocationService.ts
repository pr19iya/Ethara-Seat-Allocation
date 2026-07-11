import api from "@/lib/api";

import {
  AllocationPayload,
  AllocationResponse,
  AvailableEmployee,
  FloorSeat,
  FloorSummary,
} from "@/types/allocation";

export async function getAllocationFloors(): Promise<FloorSummary[]> {
  const response = await api.get<FloorSummary[]>("/allocation/floors");

  return response.data;
}

export async function getFloorSeatMap(
  floor: number
): Promise<FloorSeat[]> {
  const response = await api.get<FloorSeat[]>(
    `/allocation/floor/${floor}`,
    {
      timeout: 30000,
    }
  );

  return response.data;
}

export async function searchAvailableEmployees(
  search: string
): Promise<AvailableEmployee[]> {
  const response = await api.get<AvailableEmployee[]>(
    "/allocation/available-employees",
    {
      params: {
        search: search.trim() || undefined,
        limit: 20,
      },
    }
  );

  return response.data;
}

export async function allocateSeat(
  payload: AllocationPayload
): Promise<AllocationResponse> {
  const response = await api.post<AllocationResponse>(
    "/allocation/allocate",
    payload
  );

  return response.data;
}

export async function releaseSeat(
  employeeId: number
): Promise<AllocationResponse> {
  const response = await api.post<AllocationResponse>(
    "/allocation/release",
    {
      employee_id: employeeId,
    }
  );

  return response.data;
}