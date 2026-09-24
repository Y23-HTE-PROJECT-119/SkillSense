from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import create_tables

from app.routes.skills import router as skills_router
from app.routes.topics import router as topics_router
from app.routes.subtopics import router as subtopics_router
from app.routes.learning_materials import router as learning_materials_router
from app.routes.questions import router as questions_router
from app.routes.assessments import router as assessments_router
from app.routes.gap_analysis import router as gap_analysis_router
from app.routes.remediation import router as remediation_router
from app.routes.retest_mastery import router as retest_mastery_router

app = FastAPI(
    title="AI Skill Assessment Platform",
    description="AI-powered skill assessment and personalized learning platform",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup() -> None:
    create_tables()


app.include_router(skills_router)
app.include_router(topics_router)
app.include_router(subtopics_router)
app.include_router(learning_materials_router)
app.include_router(questions_router)
app.include_router(assessments_router)
app.include_router(gap_analysis_router)
app.include_router(remediation_router)
app.include_router(retest_mastery_router)






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