"use client";

import SeatCard from "./SeatCard";
import { Seat } from "@/types/seat";

interface Props {
  seats: Seat[];
}

export default function SeatGrid({ seats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {seats.map((seat) => (
        <SeatCard
          key={seat.id}
          seat={seat}
          onClick={() => undefined}
        />
      ))}
    </div>
  );
}