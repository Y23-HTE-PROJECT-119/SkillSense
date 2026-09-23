from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.learning_material import LearningMaterial
from app.db.models.subtopic import SubTopic
from app.db.schemas.learning_material import (
    LearningMaterialCreate,
    LearningMaterialResponse,
)


router = APIRouter(
    prefix="/subtopics/{subtopic_id}/learning-materials",
    tags=["Learning Materials"],
)


@router.post(
    "",
    response_model=LearningMaterialResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_learning_material(
    subtopic_id: int,
    material_data: LearningMaterialCreate,
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

    existing_material = db.execute(
        select(LearningMaterial).where(
            LearningMaterial.subtopic_id == subtopic_id,
            LearningMaterial.title == material_data.title,
        )
    ).scalar_one_or_none()

    if existing_material:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Learning material already exists.",
        )

    learning_material = LearningMaterial(
        subtopic_id=subtopic_id,
        title=material_data.title,
        description=material_data.description,
        source_type=material_data.source_type,
        source_url=material_data.source_url,
    )

    try:
        db.add(learning_material)
        db.commit()
        db.refresh(learning_material)

        return learning_material

    except Exception:
        db.rollback()
        raise


@router.get(
    "",
    response_model=list[LearningMaterialResponse],
)
def get_learning_materials(
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
        select(LearningMaterial).where(
            LearningMaterial.subtopic_id == subtopic_id
        )
    )

    learning_materials = result.scalars().all()

    return learning_materials