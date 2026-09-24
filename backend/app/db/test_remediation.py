from app.db.database import SessionLocal, create_tables
from app.db.models.assessment import Assessment, LearnerResponse
from app.db.models.question import Question
from app.db.models.subtopic import SubTopic
from app.db.models.topic import Topic
from app.services.weakness_explainer import generate_remediation_for_assessment


def test_remediation_flow():
    create_tables()
    db = SessionLocal()
    try:
        # Create a test assessment session with intentional wrong answers to test weakness explainer
        skill = db.query(Assessment).first()
        if not skill:
            print("⚠️ Running test_assessment.py first...")
            from app.db.test_assessment import test_assessment_engine_flow
            test_assessment_engine_flow()
            skill = db.query(Assessment).first()

        # Create a test assessment with an incorrect response
        subtopic = db.query(SubTopic).filter(SubTopic.name == "if-else Statements").first()
        if subtopic:
            q = Question(
                subtopic_id=subtopic.id,
                question_text="What happens when `if False:` is executed in Python?",
                explanation="The code block inside `if False:` is skipped and does not execute.",
                difficulty="medium",
            )
            db.add(q)
            db.flush()

            test_assessment = Assessment(
                skill_id=subtopic.topic.skill_id,
                title="Test Weakness Assessment",
                status="completed",
                total_score=0.0,
                max_score=1.0,
            )
            db.add(test_assessment)
            db.flush()

            # Record incorrect answer
            lr = LearnerResponse(
                assessment_id=test_assessment.id,
                question_id=q.id,
                selected_option_id=None,
                is_correct=False,
            )
            db.add(lr)
            db.commit()

            print(f"Running Weakness Explanation & Remediation for Assessment ID: {test_assessment.id}...")
            res = generate_remediation_for_assessment(assessment_id=test_assessment.id, db=db)

            print(f"\n✅ Remediation Lessons Generated Successfully!")
            print(f"Skill: {res.skill_name}")
            print(f"Weak SubTopics Count: {res.weak_subtopics_count}")

            for exp in res.explanations:
                print(f"\n--- Remediation Lesson: {exp.subtopic_name} ---")
                print(f"Concept Explanation: {exp.concept_explanation}")
                print(f"Misconception Analysis: {exp.misconception_analysis}")
                print(f"Correct Rule: {exp.correct_concept}")
                print(f"Code Example:\n{exp.example}")
                print(f"Key Takeaways:")
                for kt in exp.key_takeaways:
                    print(f"  - {kt}")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during Remediation test: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    test_remediation_flow()
