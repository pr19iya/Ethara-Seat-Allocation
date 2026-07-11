from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.employee import Employee
from app.models.seat import Seat

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    total_employees = db.query(Employee).count()

    total_seats = db.query(Seat).count()

    occupied = db.query(Seat).filter(Seat.status == "Occupied").count()

    available = db.query(Seat).filter(Seat.status == "Available").count()

    utilization = (
        round((occupied / total_seats) * 100, 2)
        if total_seats > 0
        else 0
    )

    return {
        "totalEmployees": total_employees,
        "totalSeats": total_seats,
        "occupiedSeats": occupied,
        "availableSeats": available,
        "seatUtilization": utilization,
    }