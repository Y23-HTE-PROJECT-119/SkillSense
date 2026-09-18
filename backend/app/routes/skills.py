from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.skill import Skill
from app.db.schemas.skill import SkillCreate, SkillResponse

router = APIRouter(
    prefix = "/skills",
    tags=["Skills"],
)

@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED,)

def create_skill(skill_data: SkillCreate, db: Session = Depends(get_db),):
    skill = Skill(
     name = skill_data.name,
     description = skill_data.description   
    )

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return skill

@router.get("",response_model=list[SkillResponse],)

def get_skills(
    db: Session = Depends(get_db)
):
    result = db.execute(select(Skill))
    skills = result.scalars().all()

    return skills


