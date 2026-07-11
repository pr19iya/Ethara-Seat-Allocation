from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.new_joiner_service import auto_allocate_seat

router = APIRouter(
    prefix="/new-joiner",
    tags=["New Joiner"]
)


@router.post("/{employee_id}")
def allocate(employee_id: int,
             db: Session = Depends(get_db)):

    result = auto_allocate_seat(db, employee_id)

    if "error" in result:
        raise HTTPException(400, result["error"])

    return result