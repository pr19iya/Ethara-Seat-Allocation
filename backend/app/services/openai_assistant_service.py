import os

from dotenv import load_dotenv
from openai import OpenAI
from sqlalchemy.orm import Session

from app.services.fallback_assistant_service import (
    answer_with_fallback,
)


load_dotenv()

OPENAI_API_KEY = os.getenv(
    "OPENAI_API_KEY"
)

OPENAI_MODEL = os.getenv(
    "OPENAI_MODEL",
    "gpt-5-mini",
)


def get_openai_client() -> OpenAI:
    if not OPENAI_API_KEY:
        raise RuntimeError(
            "OPENAI_API_KEY is missing. "
            "Add it to backend/.env."
        )

    return OpenAI(
        api_key=OPENAI_API_KEY
    )


def ask_openai_assistant(
    db: Session,
    question: str,
) -> str:
    client = get_openai_client()

    database_answer = answer_with_fallback(
        db=db,
        question=question,
    )

    response = client.responses.create(
        model=OPENAI_MODEL,
        instructions=(
            "You are the Ethara Workspace Assistant. "
            "Answer clearly and professionally. "
            "For questions about employees, projects, "
            "seats, allocations, floors, zones, bays, "
            "or workspace utilization, use the supplied "
            "database result as the source of truth. "
            "Never invent workspace data. "
            "If the database result says it could not "
            "understand the question, you may answer as "
            "a general assistant when the question is "
            "not about private workspace data. "
            "Keep the response concise."
        ),
        input=[
            {
                "role": "user",
                "content": (
                    f"User question:\n{question}\n\n"
                    "Workspace database result:\n"
                    f"{database_answer}"
                ),
            }
        ],
    )

    answer = response.output_text.strip()

    if not answer:
        raise RuntimeError(
            "OpenAI returned an empty response."
        )

    return answer