from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base

class SeatAllocation(Base):
    __tablename__ = "seat_allocations"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(
        Integer,
        ForeignKey("employees.id")
    )

    seat_id = Column(
        Integer,
        ForeignKey("seats.id")
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id")
    )

    allocation_status = Column(
        String(30),
        default="Allocated"
    )

    allocation_date = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    released_date = Column(
        DateTime,
        nullable=True
    )

    employee = relationship(
        "Employee",
        back_populates="allocations"
    )

    seat = relationship(
        "Seat",
        back_populates="allocations"
    )

    project = relationship(
        "Project",
        back_populates="allocations"
    )