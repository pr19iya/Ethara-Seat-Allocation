from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database.database import get_db
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse,
    EmployeeListResponse
)
from app.services.employee_service import *






router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)

@router.get("/", response_model=EmployeeListResponse)
def get_employees(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return get_all_employees(
        db,
        page,
        limit,
        search,
        department_id,
        project_id,
        status
    )

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_single_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = get_employee(db, employee_id)

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    return employee


@router.post("/", response_model=EmployeeResponse)
def add_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return create_employee(db, employee)


@router.put("/{employee_id}", response_model=EmployeeResponse)
def edit_employee(employee_id: int, employee: EmployeeUpdate, db: Session = Depends(get_db)):
    updated = update_employee(db, employee_id, employee)

    if not updated:
        raise HTTPException(status_code=404, detail="Employee not found")

    return updated


@router.delete("/{employee_id}")
def remove_employee(employee_id: int, db: Session = Depends(get_db)):
    deleted = delete_employee(db, employee_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {"message": "Employee deleted successfully"}