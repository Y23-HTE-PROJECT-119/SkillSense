from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.subtopic import SubTopic
from app.db.models.topic import Topic
from app.db.schemas.subtopic import SubTopicCreate, SubTopicResponse

router = APIRouter(
    prefix="/topics/{topic_id}/subtopics",
    tags=["SubTopics"],
)


@router.post(
    "",
    response_model = SubTopicResponse,
    status_code = status.HTTP_201_CREATED,
)
def create_subtopic(
    topic_id: int,
    subtopic_data: SubTopicCreate,
    db: Session = Depends(get_db),
):
    topic = db.execute(
        select(Topic).where(Topic.id == topic_id)
    ).scalar_one_or_none()

    if topic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found.",
        )

    existing_subtopic = db.execute(
        select(SubTopic).where(
            SubTopic.topic_id == topic_id,
            SubTopic.name == subtopic_data.name,
        )
    ).scalar_one_or_none()

    if existing_subtopic:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="SubTopic already exists.",
        )

    subtopic = SubTopic(
        topic_id=topic_id,
        name=subtopic_data.name,
        description=subtopic_data.description,
    )

    try:
        db.add(subtopic)
        db.commit()
        db.refresh(subtopic)

        return subtopic

    except Exception:
        db.rollback()
        raise


@router.get(
    "",
    response_model=list[SubTopicResponse],
)
def get_subtopics(
    topic_id: int,
    db: Session = Depends(get_db),
):
    topic = db.execute(
        select(Topic).where(Topic.id == topic_id)
    ).scalar_one_or_none()

    if topic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found.",
        )
    
    result = db.execute(
        select(SubTopic).where(SubTopic.topic_id == topic_id)
    )

    

    subtopics = result.scalars().all()

    return subtopics