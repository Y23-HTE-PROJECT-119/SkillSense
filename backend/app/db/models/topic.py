from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

class Topic(Base):
    __tablename__="topics"

    id: Mapped[int] = mapped_column(
        primary_key = True, 
        autoincrement = True,
    )

    skill_id : Mapped[int] = mapped_column(
        ForeignKey("skills.id"),
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

    skill : Mapped["Skill"] = relationship(
        back_populates = "topics",
    )

