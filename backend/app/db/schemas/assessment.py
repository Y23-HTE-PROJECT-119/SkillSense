from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class PublicOptionResponse(BaseModel):
    id: int
    option_text: str

    model_config = ConfigDict(from_attributes=True)


class PublicQuestionResponse(BaseModel):
    id: int
    subtopic_id: int
    question_text: str
    difficulty: str
    options: List[PublicOptionResponse]

    model_config = ConfigDict(from_attributes=True)


class AssessmentCreate(BaseModel):
    skill_id: int
    title: Optional[str] = None


class AssessmentSessionResponse(BaseModel):
    id: int
    skill_id: int
    title: str
    status: str
    created_at: datetime
    questions: List[PublicQuestionResponse]

    model_config = ConfigDict(from_attributes=True)


class LearnerAnswerSubmit(BaseModel):
    question_id: int
    selected_option_id: Optional[int] = None


class AssessmentSubmissionCreate(BaseModel):
    answers: List[LearnerAnswerSubmit]


class LearnerResponseDetail(BaseModel):
    question_id: int
    question_text: str
    selected_option_id: Optional[int]
    is_correct: bool
    explanation: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class AssessmentResultResponse(BaseModel):
    assessment_id: int
    skill_id: int
    title: str
    status: str
    total_score: float
    max_score: float
    percentage: float
    completed_at: datetime
    details: List[LearnerResponseDetail]

    model_config = ConfigDict(from_attributes=True)
