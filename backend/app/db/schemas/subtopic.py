from pydantic import BaseModel, ConfigDict, Field

class SubTopicCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=100,
        )

    description: str | None = Field(
        default=None,
        max_length=500,
        )

    model_config = ConfigDict(str_whitespace_strip=True)

class SubTopicResponse(BaseModel):
    id : int
    topic_id : int
    name : str
    description : str | None = None

    model_config = ConfigDict(from_attributes=True)