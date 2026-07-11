from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.employee import Employee
from app.models.seat import Seat
from app.models.department import Department
from app.models.project import Project


def get_dashboard_summary(db: Session):
    employees = db.query(Employee).count()
    seats = db.query(Seat).count()
    occupied = db.query(Seat).filter(Seat.status == "Occupied").count()
    available = db.query(Seat).filter(Seat.status == "Available").count()

    utilization = round((occupied / seats) * 100, 2) if seats else 0

    return {
        "employees": employees,
        "seats": seats,
        "occupied": occupied,
        "available": available,
        "utilization": utilization,
    }


def department_chart(db: Session):
    result = (
        db.query(
            Department.name.label("department"),
            func.count(Employee.id).label("employees"),
        )
        .outerjoin(Employee)
        .group_by(Department.id)
        .all()
    )

    return [
        {
            "department": row.department,
            "employees": row.employees,
        }
        for row in result
    ]


def project_chart(db: Session):
    result = (
        db.query(
            Project.name.label("project"),
            func.count(Employee.id).label("employees"),
        )
        .outerjoin(Employee)
        .group_by(Project.id)
        .all()
    )

    return [
        {
            "project": row.project,
            "employees": row.employees,
        }
        for row in result
    ]


def recent_joiners(db: Session):
    employees = (
        db.query(Employee)
        .order_by(Employee.joining_date.desc())
        .limit(10)
        .all()
    )

    return employees