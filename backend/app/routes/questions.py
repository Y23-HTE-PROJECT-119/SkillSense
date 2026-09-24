from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.question import Question, QuestionOption
from app.db.models.subtopic import SubTopic
from app.db.schemas.question import QuestionCreate, QuestionResponse

router = APIRouter(
    prefix="/subtopics/{subtopic_id}/questions",
    tags=["Questions"],
)


@router.post(
    "",
    response_model=QuestionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_question(
    subtopic_id: int,
    question_data: QuestionCreate,
    db: Session = Depends(get_db),
):
    subtopic = db.execute(
        select(SubTopic).where(SubTopic.id == subtopic_id)
    ).scalar_one_or_none()

    if subtopic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SubTopic not found.",
        )

    # Validate that at least one option is marked as correct
    has_correct_option = any(opt.is_correct for opt in question_data.options)
    if not has_correct_option:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one option must be marked as correct.",
        )

    question = Question(
        subtopic_id=subtopic_id,
        question_text=question_data.question_text,
        explanation=question_data.explanation,
        difficulty=question_data.difficulty,
    )

    try:
        db.add(question)
        db.flush()

        for opt in question_data.options:
            option = QuestionOption(
                question_id=question.id,
                option_text=opt.option_text,
                is_correct=opt.is_correct,
            )
            db.add(option)

        db.commit()
        db.refresh(question)
        return question

    except Exception:
        db.rollback()
        raise


@router.get(
    "",
    response_model=list[QuestionResponse],
)
def get_questions_by_subtopic(
    subtopic_id: int,
    db: Session = Depends(get_db),
):
    subtopic = db.execute(
        select(SubTopic).where(SubTopic.id == subtopic_id)
    ).scalar_one_or_none()

    if subtopic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SubTopic not found.",
        )

    result = db.execute(
        select(Question).where(Question.subtopic_id == subtopic_id)
    )
    return result.scalars().all()
