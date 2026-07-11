from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


def get_all_employees(
    db: Session,
    page: int = 1,
    limit: int = 20,
    search: str = None,
    department_id: int = None,
    project_id: int = None,
    status: str = None,
):
    query = db.query(Employee)

    if search:
        query = query.filter(
            or_(
                Employee.name.ilike(f"%{search}%"),
                Employee.email.ilike(f"%{search}%"),
                Employee.employee_code.ilike(f"%{search}%"),
            )
        )

    if department_id:
        query = query.filter(Employee.department_id == department_id)

    if project_id:
        query = query.filter(Employee.project_id == project_id)

    if status:
        query = query.filter(Employee.status == status)

    total = query.count()

    employees = (
        query.order_by(Employee.id)
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "employees": employees,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }


def get_employee(db: Session, employee_id: int):
    return (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )


def create_employee(db: Session, employee: EmployeeCreate):
    db_employee = Employee(**employee.model_dump())

    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)

    return db_employee


def update_employee(
    db: Session,
    employee_id: int,
    employee: EmployeeUpdate,
):
    db_employee = get_employee(db, employee_id)

    if not db_employee:
        return None

    update_data = employee.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_employee, key, value)

    db.commit()
    db.refresh(db_employee)

    return db_employee


def delete_employee(db: Session, employee_id: int):
    db_employee = get_employee(db, employee_id)

    if not db_employee:
        return {"message":"Employee not found"}

    db.delete(db_employee)
    db.commit()

    return {"message":"Employee deleted"}