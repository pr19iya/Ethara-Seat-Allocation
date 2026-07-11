from faker import Faker

from random import choice, randint

from datetime import date, timedelta

from app.models.department import Department
from app.models.employee import Employee
from app.models.project import Project

fake = Faker("en_IN")


def create_employees(db):

    if db.query(Employee).count() > 0:
        print("Employees already exist")
        return

    departments = db.query(Department).all()

    projects = db.query(Project).all()

    roles = [

        "Software Engineer",

        "QA Engineer",

        "Project Manager",

        "Business Analyst",

        "DevOps Engineer",

        "HR Executive",

        "Data Engineer",

        "Frontend Developer",

        "Backend Developer",

        "UI/UX Designer"

    ]

    for i in range(1, 5001):

        employee = Employee(

            employee_code=f"EMP{i:05}",

            name=fake.name(),

            email=f"employee{i}@ethara.com",

            role=choice(roles),

            joining_date=date.today() - timedelta(
                days=randint(0, 1500)
            ),

            status=choice(
                ["Active"] * 9 + ["On Leave"]
            ),

            department_id=choice(departments).id,

            project_id=choice(projects).id

        )

        db.add(employee)

        if i % 500 == 0:

            db.commit()

            print(f"Inserted {i} Employees")

    db.commit()

    print("✅ 5000 Employees Created")