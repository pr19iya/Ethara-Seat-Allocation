from faker import Faker

from app.models.project import Project

fake = Faker()


def create_projects(db):

    if db.query(Project).count() > 0:
        print("Projects already exist")
        return

    for i in range(1, 51):

        project = Project(

            name=f"Project {i}",

            description=fake.sentence(),

            manager_name=fake.name(),

            status="Active"

        )

        db.add(project)

    db.commit()

    print("✅ 50 Projects Created")