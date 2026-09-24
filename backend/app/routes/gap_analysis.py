from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.schemas.gap_analysis import SkillGapAnalysisResponse
from app.services.gap_diagnosis import evaluate_and_persist_gaps

router = APIRouter(
    prefix="/assessments",
    tags=["Gap Analysis"],
)


@router.get(
    "/{assessment_id}/diagnosis",
    response_model=SkillGapAnalysisResponse,
)
def get_assessment_gap_diagnosis(
    assessment_id: int,
    db: Session = Depends(get_db),
):
    try:
        diagnosis = evaluate_and_persist_gaps(assessment_id=assessment_id, db=db)
        return diagnosis
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve),
        )
