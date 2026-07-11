from app.database.database import SessionLocal
from app.models.seat import Seat


def seed_seats():
    db = SessionLocal()

    try:
        existing = db.query(Seat).count()

        if existing > 0:
            print("Seats already exist. Skipping seat seed.")
            return

        seats = []

        seat_counter = 1

        for floor in range(1, 6):
            for zone_number in range(1, 11):
                zone = f"Z{zone_number}"

                for seat_index in range(1, 111):
                    if seat_counter <= 4800:
                        status = "Occupied"
                    elif seat_counter <= 5300:
                        status = "Available"
                    elif seat_counter <= 5400:
                        status = "Reserved"
                    else:
                        status = "Maintenance"

                    seats.append(
                        Seat(
                            floor=floor,
                            zone=zone,
                            bay=f"B{((seat_index - 1) // 10) + 1}",
                            seat_number=f"F{floor}-{zone}-{seat_index:03}",
                            status=status,
                        )
                    )

                    seat_counter += 1

        db.bulk_save_objects(seats)
        db.commit()

        print(f"{len(seats)} seats created successfully.")

    except Exception as exc:
        db.rollback()
        print(f"Seat seeding failed: {exc}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_seats()