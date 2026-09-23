from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LearningMaterialCreate(BaseModel):
    title: str
    description: str | None = None
    source_type: str
    source_url: str | None = None


class LearningMaterialResponse(BaseModel):
    id: int
    subtopic_id: int
    title: str
    description: str | None
    source_type: str
    source_url: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)