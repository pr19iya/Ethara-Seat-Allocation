from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.seat import SeatListResponse

from app.services.seat_service import (
    get_seats,
    get_available_seats,
)

router = APIRouter(
    prefix="/seats",
    tags=["Seats"],
)


@router.get("/", response_model=SeatListResponse)
def all_seats(
    page: int = 1,
    limit: int = 50,
    floor: int = None,
    zone: str = None,
    status: str = None,
    db: Session = Depends(get_db),
):
    return get_seats(
        db,
        page,
        limit,
        floor,
        zone,
        status,
    )


@router.get("/available")
def available_seats(
    db: Session = Depends(get_db),
):
    return get_available_seats(db)