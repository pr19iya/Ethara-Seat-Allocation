from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.employee import Employee
from app.models.seat import Seat
from app.models.project import Project
from app.models.department import Department


def get_dashboard_summary(db: Session):

    total_employees = db.query(Employee).count()
    total_seats = db.query(Seat).count()

    available_seats = (
        db.query(Seat)
        .filter(Seat.status == "Available")
        .count()
    )

    occupied_seats = total_seats - available_seats

    utilization = 0

    if total_seats > 0:
        utilization = round(
            (occupied_seats / total_seats) * 100,
            2
        )

    return {
        "totalEmployees": total_employees,
        "totalSeats": total_seats,
        "occupiedSeats": occupied_seats,
        "availableSeats": available_seats,
        "seatUtilization": utilization,
        "totalProjects": db.query(Project).count(),
        "totalDepartments": db.query(Department).count()
    }


def department_wise_count(db: Session):

    data = (
        db.query(
            Department.name,
            func.count(Employee.id)
        )
        .join(Employee)
        .group_by(Department.name)
        .all()
    )

    return [
        {
            "department": d,
            "employees": c
        }
        for d, c in data
    ]


def project_wise_count(db: Session):

    data = (
        db.query(
            Project.name,
            func.count(Employee.id)
        )
        .join(Employee)
        .group_by(Project.name)
        .all()
    )

    return [
        {
            "project": p,
            "employees": c
        }
        for p, c in data
    ]