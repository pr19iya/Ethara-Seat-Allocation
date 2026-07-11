from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255))
    manager_name = Column(String(100))
    status = Column(String(30), default="Active")

    employees = relationship(
        "Employee",
        back_populates="project"
    )

    allocations = relationship(
        "SeatAllocation",
        back_populates="project"
    )