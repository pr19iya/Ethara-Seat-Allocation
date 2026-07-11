from app.models.department import Department


def create_departments(db):

    departments = [
        "Engineering",
        "Human Resources",
        "Finance",
        "Sales",
        "Marketing",
        "Operations",
        "Legal",
        "Support",
        "Administration",
        "IT"
    ]

    for dept in departments:

        exists = db.query(Department).filter(
            Department.name == dept
        ).first()

        if not exists:
            db.add(
                Department(
                    name=dept
                )
            )

    db.commit()

    print("✅ Departments Created")