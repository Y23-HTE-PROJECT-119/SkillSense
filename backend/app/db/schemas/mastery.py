from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.db.schemas.assessment import AssessmentSessionResponse


class MasteryRecordResponse(BaseModel):
    subtopic_id: int
    subtopic_name: str
    topic_name: str
    mastery_score: float
    mastery_level: str
    attempts_count: int
    last_evaluated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RetestResponse(BaseModel):
    original_assessment_id: int
    retest_assessment: AssessmentSessionResponse
    target_weak_subtopics: List[str]
    message: str

    model_config = ConfigDict(from_attributes=True)


class MasteryOverviewResponse(BaseModel):
    skill_id: int
    skill_name: str
    overall_mastery_percentage: float
    mastered_subtopics_count: int
    total_subtopics_count: int
    records: List[MasteryRecordResponse]

    model_config = ConfigDict(from_attributes=True)
