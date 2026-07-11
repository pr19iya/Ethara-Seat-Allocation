import re
from typing import Optional

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.models.project import Project
from app.models.seat import Seat
from app.models.seat_allocation import SeatAllocation


def normalize_question(question: str) -> str:
    return (
        question.strip()
        .lower()
        .replace("?", "")
        .replace("!", "")
    )


def extract_number(text: str) -> Optional[int]:
    match = re.search(r"\b(\d+)\b", text)

    if match is None:
        return None

    return int(match.group(1))


def extract_employee_search(
    question: str,
) -> Optional[str]:
    patterns = [
        r"where is employee (.+?) seated",
        r"where is (.+?) seated",
        r"find seat for employee (.+)",
        r"find seat for (.+)",
        r"which seat is assigned to (.+)",
        r"seat of employee (.+)",
        r"seat of (.+)",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            question,
        )

        if match:
            return (
                match.group(1)
                .strip()
                .rstrip("?.!")
            )

    return None


def find_employee_seat_answer(
    db: Session,
    employee_search: str,
) -> str:
    search_value = (
        f"%{employee_search.strip()}%"
    )

    employees = (
        db.query(Employee)
        .filter(
            or_(
                Employee.name.ilike(
                    search_value
                ),
                Employee.employee_code.ilike(
                    search_value
                ),
                Employee.email.ilike(
                    search_value
                ),
            )
        )
        .limit(5)
        .all()
    )

    if not employees:
        return (
            "I could not find an employee "
            f"matching '{employee_search}'."
        )

    if len(employees) > 1:
        matches = ", ".join(
            (
                f"{employee.name} "
                f"({employee.employee_code})"
            )
            for employee in employees
        )

        return (
            "I found multiple matching employees: "
            f"{matches}. Please provide the full "
            "employee code or email."
        )

    employee = employees[0]

    allocation = (
        db.query(SeatAllocation)
        .filter(
            SeatAllocation.employee_id
            == employee.id,
            SeatAllocation.allocation_status
            == "Allocated",
        )
        .first()
    )

    if allocation is None:
        return (
            f"{employee.name} does not currently "
            "have an allocated seat."
        )

    seat = (
        db.query(Seat)
        .filter(
            Seat.id == allocation.seat_id
        )
        .first()
    )

    if seat is None:
        return (
            f"{employee.name} has an allocation "
            "record, but the seat details could "
            "not be found."
        )

    return (
        f"{employee.name} is seated at "
        f"{seat.seat_number}, Floor {seat.floor}, "
        f"Zone {seat.zone}, Bay {seat.bay}."
    )


def get_seat_count_answer(
    db: Session,
    question: str,
    seat_status: str,
) -> str:
    floor = extract_number(question)

    query = db.query(Seat).filter(
        Seat.status == seat_status
    )

    if (
        floor is not None
        and "floor" in question
    ):
        query = query.filter(
            Seat.floor == floor
        )

    count = query.count()
    label = seat_status.lower()

    if (
        floor is not None
        and "floor" in question
    ):
        return (
            f"There are {count} {label} seats "
            f"on Floor {floor}."
        )

    return (
        f"There are {count} {label} seats."
    )


def get_available_seat_list_answer(
    db: Session,
    question: str,
) -> str:
    floor = extract_number(question)

    query = db.query(Seat).filter(
        Seat.status == "Available"
    )

    if (
        floor is not None
        and "floor" in question
    ):
        query = query.filter(
            Seat.floor == floor
        )

    total = query.count()

    seats = (
        query.order_by(
            Seat.floor,
            Seat.zone,
            Seat.bay,
            Seat.seat_number,
        )
        .limit(10)
        .all()
    )

    if not seats:
        if floor is not None:
            return (
                "No available seats were found "
                f"on Floor {floor}."
            )

        return "No available seats were found."

    seat_numbers = ", ".join(
        seat.seat_number
        for seat in seats
    )

    if floor is not None:
        return (
            f"There are {total} available seats "
            f"on Floor {floor}. Some available "
            f"seats are: {seat_numbers}."
        )

    return (
        f"There are {total} available seats. "
        f"Some available seats are: "
        f"{seat_numbers}."
    )


def get_floor_summary_answer(
    db: Session,
    question: str,
) -> str:
    floor = extract_number(question)

    if floor is None:
        return (
            "Please include a floor number, "
            "for example: Show the seat summary "
            "for Floor 3."
        )

    total = (
        db.query(Seat)
        .filter(Seat.floor == floor)
        .count()
    )

    available = (
        db.query(Seat)
        .filter(
            Seat.floor == floor,
            Seat.status == "Available",
        )
        .count()
    )

    occupied = (
        db.query(Seat)
        .filter(
            Seat.floor == floor,
            Seat.status == "Occupied",
        )
        .count()
    )

    reserved = (
        db.query(Seat)
        .filter(
            Seat.floor == floor,
            Seat.status == "Reserved",
        )
        .count()
    )

    maintenance = (
        db.query(Seat)
        .filter(
            Seat.floor == floor,
            Seat.status == "Maintenance",
        )
        .count()
    )

    if total == 0:
        return (
            f"No seats were found on Floor "
            f"{floor}."
        )

    return (
        f"Floor {floor} has {total} seats: "
        f"{available} available, "
        f"{occupied} occupied, "
        f"{reserved} reserved, and "
        f"{maintenance} under maintenance."
    )


def get_employee_count_answer(
    db: Session,
) -> str:
    count = db.query(Employee).count()

    return f"There are {count} employees."


def get_project_count_answer(
    db: Session,
) -> str:
    count = db.query(Project).count()

    return f"There are {count} projects."


def get_active_project_count_answer(
    db: Session,
) -> str:
    count = (
        db.query(Project)
        .filter(
            Project.status == "Active"
        )
        .count()
    )

    return (
        f"There are {count} active projects."
    )


def get_utilization_answer(
    db: Session,
) -> str:
    total_seats = db.query(Seat).count()

    occupied_seats = (
        db.query(Seat)
        .filter(
            Seat.status == "Occupied"
        )
        .count()
    )

    if total_seats == 0:
        return (
            "Seat utilization is currently 0%."
        )

    utilization = round(
        occupied_seats
        / total_seats
        * 100,
        2,
    )

    return (
        f"Current seat utilization is "
        f"{utilization}%."
    )


def get_pending_allocation_answer(
    db: Session,
) -> str:
    total_employees = (
        db.query(Employee).count()
    )

    allocated_employees = (
        db.query(
            func.count(
                func.distinct(
                    SeatAllocation.employee_id
                )
            )
        )
        .filter(
            SeatAllocation.allocation_status
            == "Allocated"
        )
        .scalar()
        or 0
    )

    pending = max(
        total_employees
        - allocated_employees,
        0,
    )

    return (
        f"There are {pending} employees "
        "without an active seat allocation."
    )


def get_project_with_most_employees_answer(
    db: Session,
) -> str:
    rows = (
        db.query(
            Project.name,
            func.count(
                Employee.id
            ).label("employee_count"),
        )
        .outerjoin(
            Employee,
            Employee.project_id
            == Project.id,
        )
        .group_by(
            Project.id,
            Project.name,
        )
        .order_by(
            func.count(
                Employee.id
            ).desc()
        )
        .all()
    )

    if not rows:
        return "No projects were found."

    project_name, employee_count = rows[0]

    return (
        f"{project_name} has the most employees, "
        f"with {employee_count} employees."
    )


def answer_with_fallback(
    db: Session,
    question: str,
) -> str:
    normalized = normalize_question(
        question
    )

    if normalized in {
        "hello",
        "hi",
        "hey",
        "good morning",
        "good evening",
    }:
        return (
            "Hello! I can help you with "
            "employees, projects, seats, "
            "allocations, floors, and "
            "seat utilization."
        )

    employee_search = (
        extract_employee_search(normalized)
    )

    if employee_search:
        return find_employee_seat_answer(
            db=db,
            employee_search=employee_search,
        )

    if (
        "show available seats" in normalized
        or "list available seats" in normalized
        or "which seats are available"
        in normalized
    ):
        return get_available_seat_list_answer(
            db=db,
            question=normalized,
        )

    if (
        "available seat" in normalized
        or "seats available" in normalized
        or "free seat" in normalized
    ):
        return get_seat_count_answer(
            db=db,
            question=normalized,
            seat_status="Available",
        )

    if (
        "occupied seat" in normalized
        or "seats occupied" in normalized
    ):
        return get_seat_count_answer(
            db=db,
            question=normalized,
            seat_status="Occupied",
        )

    if (
        "reserved seat" in normalized
        or "seats reserved" in normalized
    ):
        return get_seat_count_answer(
            db=db,
            question=normalized,
            seat_status="Reserved",
        )

    if (
        "maintenance seat" in normalized
        or "under maintenance" in normalized
        or "seats in maintenance"
        in normalized
    ):
        return get_seat_count_answer(
            db=db,
            question=normalized,
            seat_status="Maintenance",
        )

    if (
        "floor" in normalized
        and (
            "summary" in normalized
            or "seat status" in normalized
            or "seat details" in normalized
            or "how many seats" in normalized
        )
    ):
        return get_floor_summary_answer(
            db=db,
            question=normalized,
        )

    if (
        "seat utilization" in normalized
        or "utilization" in normalized
        or "occupancy rate" in normalized
    ):
        return get_utilization_answer(db)

    if (
        "pending allocation" in normalized
        or "without a seat" in normalized
        or "unallocated employees"
        in normalized
        or "employees without seat"
        in normalized
    ):
        return get_pending_allocation_answer(
            db
        )

    if (
        "most employees" in normalized
        and "project" in normalized
    ):
        return (
            get_project_with_most_employees_answer(
                db
            )
        )

    if (
        "active projects" in normalized
        or "active project count"
        in normalized
    ):
        return get_active_project_count_answer(
            db
        )

    if (
        "how many projects" in normalized
        or "total projects" in normalized
        or "project count" in normalized
    ):
        return get_project_count_answer(db)

    if (
        "how many employees" in normalized
        or "total employees" in normalized
        or "employee count" in normalized
    ):
        return get_employee_count_answer(db)

    return (
        "I could not understand that question "
        "using the fallback assistant. Try asking:\n"
        "• How many seats are available?\n"
        "• Show available seats on Floor 5\n"
        "• How many occupied seats are on Floor 3?\n"
        "• Where is employee Amit seated?\n"
        "• What is the seat utilization?\n"
        "• Which project has the most employees?\n"
        "• How many employees are without a seat?"
    )