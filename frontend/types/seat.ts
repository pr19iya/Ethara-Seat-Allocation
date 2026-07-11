export interface Seat {
  id: number;
  floor: number;
  zone: string;
  bay: string;
  seat_number: string;
  status: string;
}

export interface SeatResponse {
  seats: Seat[];
  total: number;
  page: number;
  limit: number;
}