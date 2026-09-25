from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.skill import Skill
from app.db.schemas.skill import SkillCreate, SkillResponse
from app.db.models.topic import Topic
from app.db.models.subtopic import SubTopic
from app.db.models.learning_material import LearningMaterial
from app.db.models.question import Question, QuestionOption
from app.db.models.assessment import Assessment, AssessmentQuestion, LearnerResponse
from app.db.models.subtopic_performance import SubTopicPerformance
from app.db.models.mastery import MasteryRecord

router = APIRouter(
    prefix="/skills",
    tags=["Skills"],
)


@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(skill_data: SkillCreate, db: Session = Depends(get_db)):
    existing_skill = db.execute(
        select(Skill).where(Skill.name == skill_data.name)
    ).scalar_one_or_none()

    if existing_skill:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A skill with this name already exists.",
        )

    skill = Skill(name=skill_data.name, description=skill_data.description)

    try:
        db.add(skill)
        db.commit()
        db.refresh(skill)

    except Exception:
        db.rollback()
        raise

    return skill


@router.get("", response_model=list[SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    result = db.execute(select(Skill))
    skills = result.scalars().all()
    return skills


@router.delete("/{skill_id}", status_code=status.HTTP_200_OK)
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
):
    skill = db.execute(
        select(Skill).where(Skill.id == skill_id)
    ).scalar_one_or_none()

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found.",
        )

    skill_name = skill.name

    topics = db.scalars(select(Topic).where(Topic.skill_id == skill_id)).all()
    topic_ids = [t.id for t in topics]

    subtopics = db.scalars(select(SubTopic).where(SubTopic.topic_id.in_(topic_ids))).all() if topic_ids else []
    subtopic_ids = [s.id for s in subtopics]

    assessments = db.scalars(select(Assessment).where(Assessment.skill_id == skill_id)).all()
    assessment_ids = [a.id for a in assessments]

    questions = db.scalars(select(Question).where(Question.subtopic_id.in_(subtopic_ids))).all() if subtopic_ids else []
    question_ids = [q.id for q in questions]

    try:
        # 1. Delete Learner Responses
        if assessment_ids:
            db.query(LearnerResponse).filter(LearnerResponse.assessment_id.in_(assessment_ids)).delete(synchronize_session=False)
        elif question_ids:
            db.query(LearnerResponse).filter(LearnerResponse.question_id.in_(question_ids)).delete(synchronize_session=False)

        # 2. Delete Assessment Questions
        if assessment_ids:
            db.query(AssessmentQuestion).filter(AssessmentQuestion.assessment_id.in_(assessment_ids)).delete(synchronize_session=False)
        elif question_ids:
            db.query(AssessmentQuestion).filter(AssessmentQuestion.question_id.in_(question_ids)).delete(synchronize_session=False)

        # 3. Delete SubTopic Performances
        if assessment_ids:
            db.query(SubTopicPerformance).filter(SubTopicPerformance.assessment_id.in_(assessment_ids)).delete(synchronize_session=False)
        elif subtopic_ids:
            db.query(SubTopicPerformance).filter(SubTopicPerformance.subtopic_id.in_(subtopic_ids)).delete(synchronize_session=False)

        # 4. Delete Assessments
        if assessment_ids:
            db.query(Assessment).filter(Assessment.id.in_(assessment_ids)).delete(synchronize_session=False)

        # 5. Delete Question Options & Questions
        if question_ids:
            db.query(QuestionOption).filter(QuestionOption.question_id.in_(question_ids)).delete(synchronize_session=False)
            db.query(Question).filter(Question.id.in_(question_ids)).delete(synchronize_session=False)

        # 6. Delete Learning Materials & Mastery Records & SubTopics
        if subtopic_ids:
            db.query(LearningMaterial).filter(LearningMaterial.subtopic_id.in_(subtopic_ids)).delete(synchronize_session=False)
            db.query(MasteryRecord).filter(MasteryRecord.subtopic_id.in_(subtopic_ids)).delete(synchronize_session=False)
            db.query(SubTopic).filter(SubTopic.id.in_(subtopic_ids)).delete(synchronize_session=False)

        # 7. Delete Topics
        if topic_ids:
            db.query(Topic).filter(Topic.id.in_(topic_ids)).delete(synchronize_session=False)

        # 8. Delete Skill
        db.delete(skill)

        db.commit()

        return {
            "message": f"Successfully deleted skill '{skill_name}' and all associated content.",
            "deleted_skill_id": skill_id,
        }
    except Exception:
        db.rollback()
        raise


@router.delete("/{skill_id}/questions", status_code=status.HTTP_200_OK)
def delete_all_questions_for_skill(
    skill_id: int,
    db: Session = Depends(get_db),
):
    skill = db.execute(
        select(Skill).where(Skill.id == skill_id)
    ).scalar_one_or_none()

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found.",
        )

    topics = db.scalars(select(Topic).where(Topic.skill_id == skill_id)).all()
    topic_ids = [t.id for t in topics]

    subtopics = db.scalars(select(SubTopic).where(SubTopic.topic_id.in_(topic_ids))).all() if topic_ids else []
    subtopic_ids = [s.id for s in subtopics]

    if not subtopic_ids:
        return {"message": f"No questions found for skill '{skill.name}'.", "deleted_count": 0}

    questions = db.scalars(select(Question).where(Question.subtopic_id.in_(subtopic_ids))).all()
    question_ids = [q.id for q in questions]

    if not question_ids:
        return {"message": f"No questions found for skill '{skill.name}'.", "deleted_count": 0}

    try:
        db.query(LearnerResponse).filter(LearnerResponse.question_id.in_(question_ids)).delete(synchronize_session=False)
        db.query(AssessmentQuestion).filter(AssessmentQuestion.question_id.in_(question_ids)).delete(synchronize_session=False)
        db.query(QuestionOption).filter(QuestionOption.question_id.in_(question_ids)).delete(synchronize_session=False)
        deleted_count = db.query(Question).filter(Question.id.in_(question_ids)).delete(synchronize_session=False)

        db.commit()

        return {
            "message": f"Successfully deleted all {deleted_count} questions for skill '{skill.name}'.",
            "deleted_count": deleted_count,
        }
    except Exception:
        db.rollback()
        raise
