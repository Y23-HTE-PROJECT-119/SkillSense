from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.schemas.mastery import MasteryOverviewResponse, RetestResponse
from app.services.mastery_engine import create_targeted_retest, get_skill_mastery_overview

router = APIRouter(
    tags=["Retest & Mastery"],
)


@router.post(
    "/assessments/{assessment_id}/retest",
    response_model=RetestResponse,
    status_code=status.HTTP_201_CREATED,
)
def generate_retest(
    assessment_id: int,
    db: Session = Depends(get_db),
):
    try:
        retest = create_targeted_retest(assessment_id=assessment_id, db=db)
        return retest
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/skills/{skill_id}/mastery",
    response_model=MasteryOverviewResponse,
)
def get_mastery_overview(
    skill_id: int,
    db: Session = Depends(get_db),
):
    try:
        return get_skill_mastery_overview(skill_id=skill_id, db=db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
