import api from "@/lib/api";
import { SeatResponse } from "@/types/seat";

export async function getSeats(
  page = 1,
  limit = 50,
  floor?: number,
  zone?: string,
  status?: string
): Promise<SeatResponse> {
  const response = await api.get("/seats", {
    params: {
      page,
      limit,
      floor,
      zone,
      status,
    },
  });

  return response.data;
}