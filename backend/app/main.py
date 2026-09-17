from fastapi import FastAPI

from app.db.database import create_tables

app = FastAPI(
    title="AI Skill Assessment Platform",
    description="AI-powered skill assessment and personalized learning platform",
    version="0.1.0"
)

@app.on_event("startup")
def startup() -> None:
    create_tables()


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