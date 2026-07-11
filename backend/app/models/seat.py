from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database.database import Base


class Seat(Base):
    __tablename__ = "seats"

    __table_args__ = (
        UniqueConstraint(
            "floor",
            "zone",
            "seat_number",
            name="unique_seat"
        ),
    )

    id = Column(Integer, primary_key=True)

    floor = Column(Integer, nullable=False)

    zone = Column(String(20), nullable=False)

    bay = Column(String(20), nullable=False)

    seat_number = Column(String(30), nullable=False)

    status = Column(
        String(30),
        default="Available"
    )

    allocations = relationship(
        "SeatAllocation",
        back_populates="seat"
    )