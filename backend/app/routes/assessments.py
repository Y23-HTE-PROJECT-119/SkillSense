from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.assessment import Assessment, AssessmentQuestion, LearnerResponse
from app.db.models.question import Question, QuestionOption
from app.db.models.skill import Skill
from app.db.models.subtopic import SubTopic
from app.db.models.topic import Topic
from app.db.schemas.assessment import (
    AssessmentCreate,
    AssessmentResultResponse,
    AssessmentSessionResponse,
    AssessmentSubmissionCreate,
    LearnerResponseDetail,
    PublicOptionResponse,
    PublicQuestionResponse,
)

router = APIRouter(
    prefix="/assessments",
    tags=["Assessments"],
)


@router.post(
    "",
    response_model=AssessmentSessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_assessment_session(
    data: AssessmentCreate,
    db: Session = Depends(get_db),
):
    skill = db.execute(
        select(Skill).where(Skill.id == data.skill_id)
    ).scalar_one_or_none()

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found.",
        )

    # Gather questions across all topics & subtopics under this skill
    topics = db.scalars(
        select(Topic).where(Topic.skill_id == data.skill_id)
    ).all()
    topic_ids = [t.id for t in topics]

    subtopics = db.scalars(
        select(SubTopic).where(SubTopic.topic_id.in_(topic_ids))
    ).all() if topic_ids else []
    subtopic_ids = [s.id for s in subtopics]

    questions = db.scalars(
        select(Question).where(Question.subtopic_id.in_(subtopic_ids))
    ).all() if subtopic_ids else []

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No questions available for this skill. Please generate questions for subtopics first.",
        )

    # Sample up to 10 questions
    sampled_questions = questions[:10]

    title = data.title or f"{skill.name} Assessment"
    assessment = Assessment(
        skill_id=data.skill_id,
        title=title,
        status="in_progress",
    )

    try:
        db.add(assessment)
        db.flush()

        for q in sampled_questions:
            aq = AssessmentQuestion(
                assessment_id=assessment.id,
                question_id=q.id,
            )
            db.add(aq)

        db.commit()
        db.refresh(assessment)

        # Build secure public questions response (without exposing option.is_correct)
        public_questions = []
        for q in sampled_questions:
            pub_options = [
                PublicOptionResponse(id=opt.id, option_text=opt.option_text)
                for opt in q.options
            ]
            public_questions.append(
                PublicQuestionResponse(
                    id=q.id,
                    subtopic_id=q.subtopic_id,
                    question_text=q.question_text,
                    difficulty=q.difficulty,
                    options=pub_options,
                )
            )

        return AssessmentSessionResponse(
            id=assessment.id,
            skill_id=assessment.skill_id,
            title=assessment.title,
            status=assessment.status,
            created_at=assessment.created_at,
            questions=public_questions,
        )

    except Exception:
        db.rollback()
        raise


@router.get(
    "/{assessment_id}",
    response_model=AssessmentSessionResponse,
)
def get_assessment_session(
    assessment_id: int,
    db: Session = Depends(get_db),
):
    assessment = db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    ).scalar_one_or_none()

    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment session not found.",
        )

    aq_rows = db.scalars(
        select(AssessmentQuestion).where(
            AssessmentQuestion.assessment_id == assessment_id
        )
    ).all()
    question_ids = [aq.question_id for aq in aq_rows]

    questions = db.scalars(
        select(Question).where(Question.id.in_(question_ids))
    ).all() if question_ids else []

    public_questions = []
    for q in questions:
        pub_options = [
            PublicOptionResponse(id=opt.id, option_text=opt.option_text)
            for opt in q.options
        ]
        public_questions.append(
            PublicQuestionResponse(
                id=q.id,
                subtopic_id=q.subtopic_id,
                question_text=q.question_text,
                difficulty=q.difficulty,
                options=pub_options,
            )
        )

    return AssessmentSessionResponse(
        id=assessment.id,
        skill_id=assessment.skill_id,
        title=assessment.title,
        status=assessment.status,
        created_at=assessment.created_at,
        questions=public_questions,
    )


@router.post(
    "/{assessment_id}/submit",
    response_model=AssessmentResultResponse,
)
def submit_assessment(
    assessment_id: int,
    submission: AssessmentSubmissionCreate,
    db: Session = Depends(get_db),
):
    assessment = db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    ).scalar_one_or_none()

    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment session not found.",
        )

    if assessment.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment has already been completed.",
        )

    aq_rows = db.scalars(
        select(AssessmentQuestion).where(
            AssessmentQuestion.assessment_id == assessment_id
        )
    ).all()
    question_ids = [aq.question_id for aq in aq_rows]

    questions_map = {
        q.id: q
        for q in db.scalars(
            select(Question).where(Question.id.in_(question_ids))
        ).all()
    }

    answer_map = {ans.question_id: ans.selected_option_id for ans in submission.answers}

    total_score = 0.0
    max_score = float(len(question_ids))
    details: List[LearnerResponseDetail] = []

    try:
        for q_id in question_ids:
            q = questions_map[q_id]
            selected_opt_id = answer_map.get(q_id)
            is_correct = False

            if selected_opt_id:
                opt = db.execute(
                    select(QuestionOption).where(QuestionOption.id == selected_opt_id)
                ).scalar_one_or_none()
                if opt and opt.is_correct:
                    is_correct = True

            if is_correct:
                total_score += 1.0

            lr = LearnerResponse(
                assessment_id=assessment_id,
                question_id=q_id,
                selected_option_id=selected_opt_id,
                is_correct=is_correct,
            )
            db.add(lr)

            details.append(
                LearnerResponseDetail(
                    question_id=q_id,
                    question_text=q.question_text,
                    selected_option_id=selected_opt_id,
                    is_correct=is_correct,
                    explanation=q.explanation,
                )
            )

        assessment.status = "completed"
        assessment.total_score = total_score
        assessment.max_score = max_score
        assessment.completed_at = datetime.utcnow()

        db.commit()
        db.refresh(assessment)

        percentage = (total_score / max_score * 100.0) if max_score > 0 else 0.0

        return AssessmentResultResponse(
            assessment_id=assessment.id,
            skill_id=assessment.skill_id,
            title=assessment.title,
            status=assessment.status,
            total_score=total_score,
            max_score=max_score,
            percentage=round(percentage, 2),
            completed_at=assessment.completed_at,
            details=details,
        )

    except Exception:
        db.rollback()
        raise
