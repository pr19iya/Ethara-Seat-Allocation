from app.database.database import Base, engine

from app.models.department import Department
from app.models.project import Project
from app.models.employee import Employee
from app.models.seat import Seat
from app.models.seat_allocation import SeatAllocation

print(Base.metadata.tables.keys())

Base.metadata.create_all(bind=engine)

print("Done")