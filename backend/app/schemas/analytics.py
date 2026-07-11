from pydantic import BaseModel


class DashboardSummary(BaseModel):
    employees: int
    seats: int
    occupied: int
    available: int
    utilization: float


class DepartmentAnalytics(BaseModel):
    department: str
    employees: int


class ProjectAnalytics(BaseModel):
    project: str
    employees: int