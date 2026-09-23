from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

class LearningMaterial(Base):
    __tablename__="learning_materials"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
        )
    
    subtopic_id: Mapped[int] = mapped_column(
        ForeignKey("subtopics.id"),
        nullable = False,
    )

    title : Mapped[str] = mapped_column(
        String(200),
        nullable=False
        )
    
    description : Mapped[str | None] = mapped_column(
        Text,
        nullable=True
        ) 

    source_type : Mapped[str | None] = mapped_column(
        String(500),
        nullable = False,
    )

    source_url: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
    )

    created_at : Mapped[datetime] = mapped_column(
        DateTime,
        nullable = False,
        default = datetime.utcnow,
    )

    subtopic : Mapped["SubTopic"] = relationship(
        back_populates = "learning_materials",
    )
