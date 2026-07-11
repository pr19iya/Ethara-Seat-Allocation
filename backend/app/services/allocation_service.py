from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import and_,or_
from sqlalchemy.orm import Session

from app.models.department import Department
from app.models.employee import Employee
from app.models.project import Project
from app.models.seat import Seat
from app.models.seat_allocation import SeatAllocation


def allocate_seat(
    db: Session,
    data,
):
    employee = (
        db.query(Employee)
        .filter(Employee.id == data.employee_id)
        .first()
    )

    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    seat = (
        db.query(Seat)
        .filter(Seat.id == data.seat_id)
        .first()
    )

    if seat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seat not found",
        )

    if str(seat.status).strip().lower() != "available":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This seat is not available",
        )

    existing_allocation = (
        db.query(SeatAllocation)
        .filter(
            SeatAllocation.employee_id
            == data.employee_id,
            SeatAllocation.allocation_status
            == "Allocated",
        )
        .first()
    )

    if existing_allocation is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee already has an allocated seat",
        )

    allocation = SeatAllocation(
        employee_id=data.employee_id,
        seat_id=data.seat_id,
        project_id=data.project_id,
        allocation_status="Allocated",
    )

    seat.status = "Occupied"

    try:
        db.add(allocation)
        db.commit()
        db.refresh(allocation)

        return allocation

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to allocate the seat",
        )


def release_seat(
    db: Session,
    employee_id: int,
):
    allocation = (
        db.query(SeatAllocation)
        .filter(
            SeatAllocation.employee_id == employee_id,
            SeatAllocation.allocation_status
            == "Allocated",
        )
        .first()
    )

    if allocation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active seat allocation found",
        )

    seat = (
        db.query(Seat)
        .filter(Seat.id == allocation.seat_id)
        .first()
    )

    if seat is not None:
        seat.status = "Available"

    allocation.allocation_status = "Released"

    try:
        db.commit()

        return {
            "message": "Seat released successfully"
        }

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to release the seat",
        )


def get_floor_summaries(
    db: Session,
):
    seats = (
        db.query(Seat)
        .order_by(Seat.floor)
        .all()
    )

    floors: dict[int, dict[str, int]] = {}

    for seat in seats:
        floor_number = int(seat.floor)

        if floor_number not in floors:
            floors[floor_number] = {
                "floor": floor_number,
                "total": 0,
                "available": 0,
                "occupied": 0,
                "reserved": 0,
                "maintenance": 0,
            }

        floors[floor_number]["total"] += 1

        seat_status = (
            str(seat.status)
            .strip()
            .lower()
        )

        if seat_status == "available":
            floors[floor_number]["available"] += 1

        elif seat_status == "occupied":
            floors[floor_number]["occupied"] += 1

        elif seat_status == "reserved":
            floors[floor_number]["reserved"] += 1

        elif seat_status == "maintenance":
            floors[floor_number]["maintenance"] += 1

    return [
        floors[floor_number]
        for floor_number in sorted(floors)
    ]

def get_floor_seats(
    db: Session,
    floor: int,
):
    rows = (
        db.query(
            Seat,
            SeatAllocation,
            Employee,
            Department,
            Project,
        )
        .outerjoin(
            SeatAllocation,
            and_(
                SeatAllocation.seat_id == Seat.id,
                SeatAllocation.allocation_status == "Allocated",
            ),
        )
        .outerjoin(
            Employee,
            Employee.id == SeatAllocation.employee_id,
        )
        .outerjoin(
            Department,
            Department.id == Employee.department_id,
        )
        .outerjoin(
            Project,
            Project.id == Employee.project_id,
        )
        .filter(Seat.floor == floor)
        .order_by(
            Seat.zone,
            Seat.bay,
            Seat.seat_number,
        )
        .all()
    )

    result = []

    for (
        seat,
        allocation,
        employee,
        department,
        project,
    ) in rows:
        employee_details = None

        if employee is not None:
            employee_details = {
                "id": employee.id,
                "employee_code": employee.employee_code,
                "name": employee.name,
                "email": employee.email,
                "role": employee.role,
                "department": (
                    department.name
                    if department is not None
                    else None
                ),
                "project": (
                    project.name
                    if project is not None
                    else None
                ),
            }

        result.append(
            {
                "id": seat.id,
                "floor": int(seat.floor),
                "zone": str(seat.zone),
                "bay": str(seat.bay),
                "seat_number": seat.seat_number,
                "status": seat.status,
                "employee": employee_details,
            }
        )

    return result












def search_available_employees(
    db: Session,
    search: Optional[str] = None,
    limit: int = 20,
):
    allocated_employee_ids = (
        db.query(SeatAllocation.employee_id)
        .filter(
            SeatAllocation.allocation_status
            == "Allocated"
        )
        .subquery()
    )

    query = (
        db.query(
            Employee,
            Department,
            Project,
        )
        .outerjoin(
            Department,
            Department.id
            == Employee.department_id,
        )
        .outerjoin(
            Project,
            Project.id
            == Employee.project_id,
        )
        .filter(
            Employee.status == "Active",
            ~Employee.id.in_(
                db.query(
                    allocated_employee_ids.c.employee_id
                )
            ),
        )
    )

    if search and search.strip():
        search_value = (
            f"%{search.strip()}%"
        )

        query = query.filter(
            or_(
                Employee.name.ilike(search_value),
                Employee.employee_code.ilike(
                    search_value
                ),
                Employee.email.ilike(
                    search_value
                ),
                Employee.role.ilike(
                    search_value
                ),
                Department.name.ilike(
                    search_value
                ),
                Project.name.ilike(
                    search_value
                ),
            )
        )

    rows = (
        query.order_by(Employee.name)
        .limit(limit)
        .all()
    )

    return [
        {
            "id": employee.id,
            "employee_code":
                employee.employee_code,
            "name": employee.name,
            "email": employee.email,
            "role": employee.role,
            "department_id":
                employee.department_id,
            "department": (
                department.name
                if department is not None
                else None
            ),
            "project_id": employee.project_id,
            "project": (
                project.name
                if project is not None
                else None
            ),
            "joining_date":
                employee.joining_date,
        }
        for employee, department, project in rows
    ]