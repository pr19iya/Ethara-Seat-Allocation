from sqlalchemy import Column,Integer,String,Date,ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class Employee(Base):

    __tablename__="employees"

    id=Column(Integer,primary_key=True)

    employee_code=Column(
        String(20),
        unique=True,
        nullable=False
    )

    name=Column(String(100),nullable=False)

    email=Column(
        String(100),
        unique=True,
        nullable=False
    )

    role=Column(String(50))

    joining_date=Column(Date)

    status=Column(
        String(30),
        default="Active"
    )

    department_id=Column(
        Integer,
        ForeignKey("departments.id")
    )

    project_id=Column(
        Integer,
        ForeignKey("projects.id")
    )

    department=relationship(
        "Department",
        back_populates="employees"
    )

    project=relationship(
        "Project",
        back_populates="employees"
    )

    allocations=relationship(
        "SeatAllocation",
        back_populates="employee"
    )