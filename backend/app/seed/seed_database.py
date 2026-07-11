from app.database.database import SessionLocal

from app.seed.seed_departments import create_departments
from app.seed.seed_projects import create_projects
from app.seed.seed_seats import create_seats
from app.seed.seed_employees import create_employees
from app.seed.seed_allocations import allocate_seats


def seed_database():

    db = SessionLocal()

    try:

        create_departments(db)

        create_projects(db)

        create_seats(db)

        create_employees(db)

        allocate_seats(db)

        print("\n🎉 Database Seeded Successfully!")

    finally:

        db.close()


if __name__ == "__main__":

    seed_database()