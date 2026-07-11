from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional
from typing import List

class EmployeeBase(BaseModel):
    employee_code: str
    name: str
    email: EmailStr
    role: str
    joining_date: date
    department_id: int
    project_id: int
    status: str = "Active"


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    department_id: Optional[int] = None
    project_id: Optional[int] = None
    status: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    id: int

    class Config:
        from_attributes = True



class EmployeeListResponse(BaseModel):
    total: int
    page: int
    limit: int
    employees: List[EmployeeResponse]

    class Config:
        from_attributes = True