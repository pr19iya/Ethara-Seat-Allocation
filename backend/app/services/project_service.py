from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate


def get_projects(
    db: Session,
    page: int = 1,
    limit: int = 20,
    search: str = "",
):
    query = db.query(Project)

    if search:
        query = query.filter(
            Project.name.ilike(f"%{search}%")
        )

    total = query.count()

    projects = (
        query.order_by(Project.id)
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "projects": projects,
        "total": total,
        "page": page,
        "limit": limit,
    }


def create_project(
    db: Session,
    project: ProjectCreate,
):
    new_project = Project(**project.model_dump())

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


def update_project(
    db: Session,
    project_id: int,
    project: ProjectCreate,
):
    existing = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not existing:
        raise Exception("Project not found")

    for key, value in project.model_dump().items():
        setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return existing


def delete_project(
    db: Session,
    project_id: int,
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise Exception("Project not found")

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully"
    }