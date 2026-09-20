from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

class Skill(Base):
    __tablename__="skills"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
        )

    name : Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
        )
    description : Mapped[str | None] = mapped_column(
        Text,
        nullable=True
        ) 
    
    topics : Mapped[list["Topic"]] = relationship(
        back_populates = "skill",
    )