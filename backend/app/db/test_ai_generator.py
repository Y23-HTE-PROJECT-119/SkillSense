from app.db.database import SessionLocal
from app.db.models.subtopic import SubTopic
from app.services.ai_generator import generate_questions_for_subtopic
from app.db.models.question import Question, QuestionOption


def test_ai_generator_flow():
    db = SessionLocal()
    try:
        # Get first subtopic or fallback to ID 1
        subtopic = db.query(SubTopic).first()
        if not subtopic:
            print("⚠️ No subtopic found in database. Run test_questions.py first!")
            return

        print(f"Generating questions for SubTopic: '{subtopic.name}' (ID: {subtopic.id})...")
        
        # Test AI Generator Service
        questions_data = generate_questions_for_subtopic(
            subtopic_name=subtopic.name,
            subtopic_description=subtopic.description,
            count=2,
            difficulty="medium",
        )

        print(f"Generated {len(questions_data)} question payloads successfully!")
        
        # Save to database
        saved_questions = []
        for q_data in questions_data:
            q = Question(
                subtopic_id=subtopic.id,
                question_text=q_data.question_text,
                explanation=q_data.explanation,
                difficulty=q_data.difficulty,
            )
            db.add(q)
            db.flush()

            for opt in q_data.options:
                option = QuestionOption(
                    question_id=q.id,
                    option_text=opt.option_text,
                    is_correct=opt.is_correct,
                )
                db.add(option)
            saved_questions.append(q)

        db.commit()

        print(f"\n✅ Saved {len(saved_questions)} generated questions to MySQL!")
        for idx, q in enumerate(saved_questions, 1):
            print(f"\n--- Question #{idx} (ID: {q.id}) ---")
            print(f"Text: {q.question_text}")
            print(f"Difficulty: {q.difficulty}")
            print(f"Explanation: {q.explanation}")
            print("Options:")
            for opt in q.options:
                print(f"  [{'✓' if opt.is_correct else ' '}] {opt.option_text}")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during AI Question Generation test: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    test_ai_generator_flow()
