from app.models.employee import Employee
from app.models.seat import Seat
from app.models.seat_allocation import SeatAllocation


def allocate_seats(db):

    if db.query(SeatAllocation).count() > 0:
        print("Seat Allocations already exist")
        return

    employees = db.query(Employee).all()

    seats = db.query(Seat).all()

    for employee, seat in zip(employees, seats):

        seat.status = "Occupied"

        allocation = SeatAllocation(

            employee_id=employee.id,

            seat_id=seat.id,

            project_id=employee.project_id,

            allocation_status="Allocated"

        )

        db.add(allocation)

    db.commit()

    print("✅ Seat Allocation Completed")