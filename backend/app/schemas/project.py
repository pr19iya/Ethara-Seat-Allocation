from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    manager_name: str | None = None
    status: str = "Active"


class ProjectResponse(ProjectCreate):
    id: int

    class Config:
        from_attributes = True