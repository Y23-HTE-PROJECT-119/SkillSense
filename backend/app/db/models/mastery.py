from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class MasteryRecord(Base):
    __tablename__ = "mastery_records"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    subtopic_id: Mapped[int] = mapped_column(
        ForeignKey("subtopics.id"),
        nullable=False,
    )
    mastery_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )
    mastery_level: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="novice",  # novice, learning, proficient, mastered
    )
    attempts_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    last_evaluated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    subtopic: Mapped["SubTopic"] = relationship()
