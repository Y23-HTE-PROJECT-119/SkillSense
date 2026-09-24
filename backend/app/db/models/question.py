from datetime import datetime
from typing import List, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    subtopic_id: Mapped[int] = mapped_column(
        ForeignKey("subtopics.id"),
        nullable=False,
    )
    question_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    explanation: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    difficulty: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="medium",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    subtopic: Mapped["SubTopic"] = relationship(
        back_populates="questions",
    )
    options: Mapped[List["QuestionOption"]] = relationship(
        back_populates="question",
        cascade="all, delete-orphan",
    )


class QuestionOption(Base):
    __tablename__ = "question_options"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    question_id: Mapped[int] = mapped_column(
        ForeignKey("questions.id"),
        nullable=False,
    )
    option_text: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )
    is_correct: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    question: Mapped["Question"] = relationship(
        back_populates="options",
    )
