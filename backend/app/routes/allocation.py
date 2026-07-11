from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.allocation import (
    AllocationCreate,
    AllocationResponse,
    AvailableEmployeeResponse,
    FloorSeatResponse,
    FloorSummaryResponse,
    ReleaseRequest,
)
from app.services import allocation_service


router = APIRouter(
    prefix="/allocation",
    tags=["Allocation"],
)


@router.get(
    "/floors",
    response_model=List[FloorSummaryResponse],
)
def get_floors(
    db: Session = Depends(get_db),
):
    return allocation_service.get_floor_summaries(
        db=db
    )


@router.get(
    "/available-employees",
    response_model=List[AvailableEmployeeResponse],
)
def get_available_employees(
    search: Optional[str] = Query(
        default=None,
        max_length=100,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
):
    return allocation_service.search_available_employees(
        db=db,
        search=search,
        limit=limit,
    )


@router.get(
    "/floor/{floor}",
    response_model=List[FloorSeatResponse],
)
def get_floor_seat_map(
    floor: int,
    db: Session = Depends(get_db),
):
    return allocation_service.get_floor_seats(
        db=db,
        floor=floor,
    )


@router.post(
    "/allocate",
)
def allocate(
    data: AllocationCreate,
    db: Session = Depends(get_db),
):
    return allocation_service.allocate_seat(
        db=db,
        data=data,
    )


@router.post(
    "/release",
    response_model=AllocationResponse,
)
def release(
    data: ReleaseRequest,
    db: Session = Depends(get_db),
):
    return allocation_service.release_seat(
        db=db,
        employee_id=data.employee_id,
    )