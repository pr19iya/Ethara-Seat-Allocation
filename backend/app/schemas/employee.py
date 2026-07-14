from datetime import date
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class EmployeeBase(BaseModel):
    employee_code: str
    name: str
    email: EmailStr
    role: str
    joining_date: date
    department_id: Optional[int] = None
    project_id: Optional[int] = None
    status: str = "Active"


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    joining_date: Optional[date] = None
    department_id: Optional[int] = None
    project_id: Optional[int] = None
    status: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class EmployeeListResponse(BaseModel):
    employees: List[EmployeeResponse]
    total: int
    page: int
    limit: int
    pages: int