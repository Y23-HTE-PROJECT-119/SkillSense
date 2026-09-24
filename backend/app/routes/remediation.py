from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.schemas.remediation import RemediationResponse
from app.services.weakness_explainer import generate_remediation_for_assessment

router = APIRouter(
    prefix="/assessments",
    tags=["Remediation"],
)


@router.get(
    "/{assessment_id}/remediation",
    response_model=RemediationResponse,
)
def get_assessment_remediation(
    assessment_id: int,
    db: Session = Depends(get_db),
):
    try:
        remediation = generate_remediation_for_assessment(
            assessment_id=assessment_id, db=db
        )
        return remediation
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve),
        )
