from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.topic import Topic
from app.db.models.skill import Skill
from app.db.schemas.topic import TopicCreate, TopicResponse

router = APIRouter(
    prefix="/skills/{skill_id}/topics",
    tags=["Skills"],
)


@router.post(
    "",
    response_model=TopicResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_topic(
    skill_id: int,
    topic_data: TopicCreate,
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

    existing_topic = db.execute(
        select(Topic).where(
            Topic.skill_id == skill_id,
            Topic.name == topic_data.name,
        )
    ).scalar_one_or_none()

    if existing_topic:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Topic already exists.",
        )

    topic = Topic(
        skill_id=skill_id,
        name=topic_data.name,
        description=topic_data.description,
    )

    try:
        db.add(topic)
        db.commit()
        db.refresh(topic)

        return topic

    except Exception:
        db.rollback()
        raise


@router.get(
    "",
    response_model=list[TopicResponse],
)
def get_topics(
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
    
    result = db.execute(
        select(Topic).where(Topic.skill_id == skill_id)
    )

    

    topics = result.scalars().all()

    return topics