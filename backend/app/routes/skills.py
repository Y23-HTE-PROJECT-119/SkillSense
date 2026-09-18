from fastapi import APIRouter, Depends, status, HTTPException
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

    existing_skill= db.execute(select(Skill).where(Skill.name==skill_data.name)).scalar_one_or_none()

    if(existing_skill):
        raise HTTPException(
            status_code = status.HTTP_409_CONFLICT,
            detail = "A skill with this name already exists.",
        )
    
    skill = Skill(
     name = skill_data.name,
     description = skill_data.description   
    )

    try:
        db.add(skill)
        db.commit()
        db.refresh(skill)

    except Exception:
        db.rollback()
        raise
    

    return skill

@router.get("",response_model=list[SkillResponse],)

def get_skills(
    db: Session = Depends(get_db)
):
    result = db.execute(select(Skill))
    skills = result.scalars().all()

    return skills


