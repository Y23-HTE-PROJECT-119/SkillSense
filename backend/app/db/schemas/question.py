from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class QuestionOptionBase(BaseModel):
    option_text: str
    is_correct: bool = False


class QuestionOptionCreate(QuestionOptionBase):
    pass


class QuestionOptionResponse(QuestionOptionBase):
    id: int
    question_id: int

    model_config = ConfigDict(from_attributes=True)


class QuestionBase(BaseModel):
    question_text: str
    explanation: Optional[str] = None
    difficulty: str = "medium"


class QuestionCreate(QuestionBase):
    options: List[QuestionOptionCreate]


class QuestionResponse(QuestionBase):
    id: int
    subtopic_id: int
    created_at: datetime
    options: List[QuestionOptionResponse]

    model_config = ConfigDict(from_attributes=True)
