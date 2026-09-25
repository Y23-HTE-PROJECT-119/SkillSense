# from datetime import datetime
# from typing import Optional

# from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
# from sqlalchemy.orm import Mapped, mapped_column, relationship

# from app.db.database import Base


# class SubTopicPerformance(Base):
#     __tablename__ = "subtopic_performances"

#     id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
#     assessment_id: Mapped[int] = mapped_column(
#         ForeignKey("assessments.id"),
#         nullable=False,
#     )
#     subtopic_id: Mapped[int] = mapped_column(
#         ForeignKey("subtopics.id"),
#         nullable=False,
#     )
#     total_questions: Mapped[int] = mapped_column(
#         Integer,
#         nullable=False,
#         default=0,
#     )
#     correct_answers: Mapped[int] = mapped_column(
#         Integer,
#         nullable=False,
#         default=0,
#     )
#     accuracy_percentage: Mapped[float] = mapped_column(
#         Float,
#         nullable=False,
#         default=0.0,
#     )
#     status: Mapped[str] = mapped_column(
#         String(50),
#         nullable=False,  # proficient, weak, critical
#     )
#     severity: Mapped[str] = mapped_column(
#         String(50),
#         nullable=False,  # low, medium, high, critical
#     )
#     created_at: Mapped[datetime] = mapped_column(
#         DateTime,
#         nullable=False,
#         default=datetime.utcnow,
#     )

#     assessment: Mapped["Assessment"] = relationship()
#     subtopic: Mapped["SubTopic"] = relationship()


from datetime import datetime
from typing import Optional

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class SubTopicPerformance(Base):
    __tablename__ = "subtopic_performances"

    __table_args__ = (
        UniqueConstraint(
            "assessment_id",
            "subtopic_id",
            name="uq_assessment_subtopic_performance",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    assessment_id: Mapped[int] = mapped_column(
        ForeignKey("assessments.id"),
        nullable=False,
    )

    subtopic_id: Mapped[int] = mapped_column(
        ForeignKey("subtopics.id"),
        nullable=False,
    )

    total_questions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    correct_answers: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    accuracy_percentage: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    severity: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    assessment: Mapped["Assessment"] = relationship()

    subtopic: Mapped["SubTopic"] = relationship()