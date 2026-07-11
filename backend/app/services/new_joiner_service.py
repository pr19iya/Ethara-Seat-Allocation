from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.models.seat import Seat
from app.models.seat_allocation import SeatAllocation


def auto_allocate_seat(db: Session, employee_id: int):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        return {"error": "Employee not found"}

    existing = db.query(SeatAllocation).filter(
        SeatAllocation.employee_id == employee_id,
        SeatAllocation.allocation_status == "Allocated"
    ).first()

    if existing:
        return {"error": "Employee already has a seat"}

    seat = db.query(Seat).filter(
        Seat.status == "Available"
    ).first()

    if not seat:
        return {"error": "No seats available"}

    seat.status = "Occupied"

    allocation = SeatAllocation(
        employee_id=employee.id,
        seat_id=seat.id,
        project_id=employee.project_id
    )

    db.add(allocation)
    db.commit()

    return {
        "employee": employee.name,
        "seat": seat.seat_number,
        "floor": seat.floor,
        "zone": seat.zone
    }