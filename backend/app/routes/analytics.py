from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.department import Department
from app.models.employee import Employee
from app.models.project import Project
from app.models.seat import Seat
from app.models.seat_allocation import SeatAllocation

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("")
def dashboard_summary(db: Session = Depends(get_db)):
    employees = db.query(Employee).count()
    projects = db.query(Project).count()
    seats = db.query(Seat).count()

    occupied = (
        db.query(Seat)
        .filter(Seat.status == "Occupied")
        .count()
    )

    available = (
        db.query(Seat)
        .filter(Seat.status == "Available")
        .count()
    )

    reserved = (
        db.query(Seat)
        .filter(Seat.status == "Reserved")
        .count()
    )

    maintenance = (
        db.query(Seat)
        .filter(Seat.status == "Maintenance")
        .count()
    )

    allocated_employee_ids = (
        db.query(SeatAllocation.employee_id)
        .filter(SeatAllocation.allocation_status == "Allocated")
        .subquery()
    )

    pending_joiners = (
        db.query(Employee)
        .filter(
            Employee.status == "Active",
            ~Employee.id.in_(allocated_employee_ids),
        )
        .count()
    )

    utilization = round(
        (occupied / seats) * 100,
        2,
    ) if seats else 0

    return {
        "employees": employees,
        "projects": projects,
        "seats": seats,
        "occupied": occupied,
        "available": available,
        "reserved": reserved,
        "maintenance": maintenance,
        "pending_joiners": pending_joiners,
        "utilization": utilization,
    }


@router.get("/department")
def department_chart(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Department.name.label("department"),
            func.count(Employee.id).label("count"),
        )
        .outerjoin(
            Employee,
            Employee.department_id == Department.id,
        )
        .group_by(Department.id, Department.name)
        .order_by(func.count(Employee.id).desc())
        .all()
    )

    return [
        {
            "department": row.department,
            "count": row.count,
        }
        for row in rows
    ]


@router.get("/projects")
def project_chart(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Project.name.label("project"),
            func.count(Employee.id).label("count"),
        )
        .outerjoin(
            Employee,
            Employee.project_id == Project.id,
        )
        .group_by(Project.id, Project.name)
        .order_by(func.count(Employee.id).desc())
        .limit(10)
        .all()
    )

    return [
        {
            "project": row.project,
            "count": row.count,
        }
        for row in rows
    ]


@router.get("/recent-joiners")
def recent_joiners(db: Session = Depends(get_db)):
    employees = (
        db.query(Employee)
        .order_by(
            Employee.joining_date.desc(),
            Employee.id.desc(),
        )
        .limit(8)
        .all()
    )

    return [
        {
            "id": employee.id,
            "employee_code": employee.employee_code,
            "name": employee.name,
            "email": employee.email,
            "role": employee.role,
            "status": employee.status,
            "joining_date": (
                employee.joining_date.isoformat()
                if employee.joining_date
                else None
            ),
            "department_id": employee.department_id,
            "project_id": employee.project_id,
        }
        for employee in employees
    ]


@router.get("/floor-utilization")
def floor_utilization(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Seat.floor.label("floor"),
            func.count(Seat.id).label("total"),
            func.count(Seat.id)
            .filter(Seat.status == "Occupied")
            .label("occupied"),
        )
        .group_by(Seat.floor)
        .order_by(Seat.floor)
        .all()
    )

    return [
        {
            "floor": row.floor,
            "total": row.total,
            "occupied": row.occupied,
            "available": row.total - row.occupied,
            "utilization": round(
                (row.occupied / row.total) * 100,
                2,
            ) if row.total else 0,
        }
        for row in rows
    ]


@router.get("/project-utilization")
def project_utilization(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Project.id.label("project_id"),
            Project.name.label("project"),
            func.count(SeatAllocation.id).label("allocated_seats"),
        )
        .outerjoin(
            SeatAllocation,
            (SeatAllocation.project_id == Project.id)
            & (SeatAllocation.allocation_status == "Allocated"),
        )
        .group_by(Project.id, Project.name)
        .order_by(func.count(SeatAllocation.id).desc())
        .all()
    )

    return [
        {
            "project_id": row.project_id,
            "project": row.project,
            "allocated_seats": row.allocated_seats,
        }
        for row in rows
    ]