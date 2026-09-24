from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.question import Question, QuestionOption
from app.db.models.subtopic import SubTopic
from app.db.schemas.question import QuestionCreate, QuestionResponse
from app.services.ai_generator import generate_questions_for_subtopic

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


@router.post(
    "/generate",
    response_model=list[QuestionResponse],
    status_code=status.HTTP_201_CREATED,
)
def generate_questions_api(
    subtopic_id: int,
    count: int = 3,
    difficulty: str = "medium",
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

    learning_material_text = ""
    if subtopic.learning_materials:
        learning_material_text = "\n".join(
            f"{mat.title}: {mat.description or ''}"
            for mat in subtopic.learning_materials
        )

    generated_questions = generate_questions_for_subtopic(
        subtopic_name=subtopic.name,
        subtopic_description=subtopic.description,
        count=count,
        difficulty=difficulty,
        learning_material_text=learning_material_text,
    )

    created_questions = []
    try:
        for q_data in generated_questions:
            question = Question(
                subtopic_id=subtopic_id,
                question_text=q_data.question_text,
                explanation=q_data.explanation,
                difficulty=q_data.difficulty,
            )
            db.add(question)
            db.flush()

            for opt in q_data.options:
                option = QuestionOption(
                    question_id=question.id,
                    option_text=opt.option_text,
                    is_correct=opt.is_correct,
                )
                db.add(option)
            created_questions.append(question)

        db.commit()
        for q in created_questions:
            db.refresh(q)
        return created_questions

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

