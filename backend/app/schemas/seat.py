from pydantic import BaseModel
from typing import Optional


class SeatBase(BaseModel):
    floor: int
    zone: str
    bay: str
    seat_number: str
    status: str = "Available"


class SeatCreate(SeatBase):
    pass


class SeatUpdate(SeatBase):
    pass


class SeatResponse(SeatBase):
    id: int

    class Config:
        from_attributes = True


class SeatListResponse(BaseModel):
    total: int
    page: int
    limit: int
    seats: list[SeatResponse]