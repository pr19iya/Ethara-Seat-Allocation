from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.seat import Seat


def get_seats(
    db: Session,
    page: int = 1,
    limit: int = 50,
    floor: int = None,
    zone: str = None,
    status: str = None,
):
    query = db.query(Seat)

    if floor:
        query = query.filter(Seat.floor == floor)

    if zone:
        query = query.filter(Seat.zone == zone)

    if status:
        query = query.filter(Seat.status == status)

    total = query.count()

    seats = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "seats": seats,
        "total": total,
        "page": page,
        "limit": limit,
    }


def get_available_seats(db: Session):
    return (
        db.query(Seat)
        .filter(Seat.status == "Available")
        .all()
    )