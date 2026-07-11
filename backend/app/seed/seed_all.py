from app.database.database import SessionLocal
from app.models.employee import Employee
from app.models.seat import Seat
from app.models.seat_allocation import SeatAllocation


def seed_allocations() -> None:
    db = SessionLocal()

    try:
        db.query(SeatAllocation).delete(synchronize_session=False)

        employees = (
            db.query(Employee)
            .filter(Employee.status == "Active")
            .order_by(Employee.id)
            .limit(4800)
            .all()
        )

        seats = (
            db.query(Seat)
            .filter(Seat.status == "Occupied")
            .order_by(Seat.id)
            .limit(4800)
            .all()
        )

        allocation_count = min(len(employees), len(seats))

        allocations = []

        for index in range(allocation_count):
            employee = employees[index]
            seat = seats[index]

            allocations.append(
                SeatAllocation(
                    employee_id=employee.id,
                    seat_id=seat.id,
                    project_id=employee.project_id,
                    allocation_status="Allocated",
                )
            )

        db.bulk_save_objects(allocations)
        db.commit()

        print(f"{allocation_count} allocations created successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_allocations()