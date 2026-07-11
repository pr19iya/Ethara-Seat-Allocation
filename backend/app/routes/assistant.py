from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.fallback_assistant_service import (
    answer_with_fallback,
)
from app.services.openai_assistant_service import (
    ask_openai_assistant,
)


router = APIRouter(
    prefix="/assistant",
    tags=["Assistant"],
)


class AssistantRequest(BaseModel):
    question: str


class AssistantResponse(BaseModel):
    answer: str
    source: str


@router.post(
    "/ask",
    response_model=AssistantResponse,
)
def ask_assistant(
    payload: AssistantRequest,
    db: Session = Depends(get_db),
):
    question = payload.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question is required.",
        )

    try:
        answer = ask_openai_assistant(
            db=db,
            question=question,
        )

        return {
            "answer": answer,
            "source": "openai",
        }

    except Exception as exc:
        print(
            "OpenAI failed. Using fallback:",
            repr(exc),
        )

        fallback_answer = answer_with_fallback(
            db=db,
            question=question,
        )

        return {
            "answer": fallback_answer,
            "source": "fallback",
        }