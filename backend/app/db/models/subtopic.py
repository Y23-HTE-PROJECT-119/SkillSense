from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

class SubTopic(Base):
    __tablename__="subtopics"

    id: Mapped[int] = mapped_column(
        primary_key = True, 
        autoincrement = True,
    )

    topic_id : Mapped[int] = mapped_column(
        ForeignKey("topics.id"),
        nullable = False,
    )

    name : Mapped[str] = mapped_column(
        String(100),
        nullable = False,
    )

    description : Mapped[str | None] = mapped_column(
        Text,
        nullable = True,
    )

    topic : Mapped["Topic"] = relationship(
        back_populates = "subtopic",
    )

    learning_materials : Mapped[list["LearningMaterial"]] = relationship(
        back_populates = "subtopic"
    )

