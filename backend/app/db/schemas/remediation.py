from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class RemediationExplanation(BaseModel):
    subtopic_id: int
    subtopic_name: str
    concept_explanation: str
    misconception_analysis: str
    correct_concept: str
    example: str
    key_takeaways: List[str]
    recommended_material: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class RemediationResponse(BaseModel):
    assessment_id: int
    skill_id: int
    skill_name: str
    weak_subtopics_count: int
    explanations: List[RemediationExplanation]

    model_config = ConfigDict(from_attributes=True)
