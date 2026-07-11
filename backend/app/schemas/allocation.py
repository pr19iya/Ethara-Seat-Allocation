from pydantic import BaseModel
from datetime import datetime
from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict
class AllocationCreate(BaseModel):
    employee_id: int
    seat_id: int
    project_id: Optional[int] = None


class ReleaseRequest(BaseModel):
    employee_id: int


class AllocationResponse(BaseModel):
    message: str
   
class EmployeeAllocationDetails(BaseModel):
    id: int
    employee_code: str
    name: str
    email: str
    role: Optional[str] = None
    department: Optional[str] = None
    project: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
class FloorSeatResponse(BaseModel):
    id: int
    floor: int
    zone: str
    bay: str
    seat_number: str
    status: str
    employee: Optional[EmployeeAllocationDetails] = None

    model_config = ConfigDict(from_attributes=True)


class FloorSummaryResponse(BaseModel):
    floor: int
    total: int
    available: int
    occupied: int
    reserved: int
    maintenance: int

class AvailableEmployeeResponse(BaseModel):
    id: int
    employee_code: str
    name: str
    email: str
    role: Optional[str] = None
    department_id: Optional[int] = None
    department: Optional[str] = None
    project_id: Optional[int] = None
    project: Optional[str] = None
    joining_date: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)    