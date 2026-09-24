from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class SubTopicGapDetail(BaseModel):
    subtopic_id: int
    subtopic_name: str
    topic_name: str
    total_questions: int
    correct_answers: int
    accuracy_percentage: float
    status: str  # proficient, weak, critical
    severity: str  # low, medium, high, critical
    evidence_summary: str

    model_config = ConfigDict(from_attributes=True)


class SkillGapAnalysisResponse(BaseModel):
    assessment_id: int
    skill_id: int
    skill_name: str
    overall_percentage: float
    status: str
    completed_at: datetime
    strong_subtopics: List[str]
    weak_subtopics: List[str]
    diagnoses: List[SubTopicGapDetail]

    model_config = ConfigDict(from_attributes=True)
