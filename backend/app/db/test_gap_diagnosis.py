from app.db.database import SessionLocal, create_tables
from app.db.models.assessment import Assessment, LearnerResponse
from app.db.models.question import Question, QuestionOption
from app.db.models.skill import Skill
from app.db.models.subtopic import SubTopic
from app.db.models.topic import Topic
from app.services.gap_diagnosis import evaluate_and_persist_gaps


def test_gap_diagnosis_flow():
    create_tables()
    db = SessionLocal()
    try:
        # Fetch or create assessment session
        assessment = db.query(Assessment).filter(Assessment.status == "completed").first()
        if not assessment:
            print("⚠️ No completed assessment found. Running test_assessment.py first...")
            from app.db.test_assessment import test_assessment_engine_flow
            test_assessment_engine_flow()
            assessment = db.query(Assessment).filter(Assessment.status == "completed").first()

        print(f"Running Gap Diagnosis for Assessment ID: {assessment.id}...")
        
        result = evaluate_and_persist_gaps(assessment_id=assessment.id, db=db)

        print(f"\n✅ Gap Diagnosis Completed Successfully!")
        print(f"Skill: {result.skill_name}")
        print(f"Overall Score: {result.overall_percentage}%")
        print(f"Strong SubTopics ({len(result.strong_subtopics)}): {result.strong_subtopics}")
        print(f"Weak SubTopics ({len(result.weak_subtopics)}): {result.weak_subtopics}")

        print("\n--- Detailed SubTopic Gap Diagnoses ---")
        for diag in result.diagnoses:
            print(f"SubTopic: {diag.subtopic_name} (Topic: {diag.topic_name})")
            print(f"  Accuracy: {diag.correct_answers}/{diag.total_questions} ({diag.accuracy_percentage}%)")
            print(f"  Status: {diag.status.upper()} | Severity: {diag.severity.upper()}")
            print(f"  Evidence: {diag.evidence_summary}\n")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during Gap Diagnosis test: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    test_gap_diagnosis_flow()
