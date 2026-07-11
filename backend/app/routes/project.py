from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
)

from app.services.project_service import (
    get_projects,
    create_project,
    update_project,
    delete_project,
)

router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


@router.get("/")
def list_projects(
    page: int = 1,
    limit: int = 20,
    search: str = "",
    db: Session = Depends(get_db),
):
    return get_projects(
        db,
        page,
        limit,
        search,
    )


@router.post(
    "/",
    response_model=ProjectResponse,
)
def create(
    project: ProjectCreate,
    db: Session = Depends(get_db),
):
    return create_project(
        db,
        project,
    )


@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update(
    project_id: int,
    project: ProjectCreate,
    db: Session = Depends(get_db),
):
    return update_project(
        db,
        project_id,
        project,
    )


@router.delete("/{project_id}")
def delete(
    project_id: int,
    db: Session = Depends(get_db),
):
    return delete_project(
        db,
        project_id,
    )