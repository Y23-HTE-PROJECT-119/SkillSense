from fastapi import FastAPI

from app.db.database import create_tables

from app.routes.skills import router as skills_router
from app.routes.topics import router as topics_router
from app.routes.subtopics import router as subtopics_router

app = FastAPI(
    title="AI Skill Assessment Platform",
    description="AI-powered skill assessment and personalized learning platform",
    version="0.1.0"
)

@app.on_event("startup")
def startup() -> None:
    create_tables()

app.include_router(skills_router)
app.include_router(topics_router)
app.include_router(subtopics_router)

@app.get("/")
def root():
    return {
        "message": "Skill Assessment Platform API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }