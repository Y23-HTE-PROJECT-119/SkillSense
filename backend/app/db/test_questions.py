from app.db.database import SessionLocal
from app.db.models.skill import Skill
from app.db.models.topic import Topic
from app.db.models.subtopic import SubTopic
from app.db.models.question import Question, QuestionOption


def test_question_flow():
    db = SessionLocal()
    try:
        # 1. Get or create test skill
        skill = db.query(Skill).filter(Skill.name == "Python Basics").first()
        if not skill:
            skill = Skill(name="Python Basics", description="Core Python fundamentals")
            db.add(skill)
            db.commit()
            db.refresh(skill)

        # 2. Get or create test topic
        topic = db.query(Topic).filter(Topic.skill_id == skill.id, Topic.name == "Control Flow").first()
        if not topic:
            topic = Topic(skill_id=skill.id, name="Control Flow", description="Conditionals and loops")
            db.add(topic)
            db.commit()
            db.refresh(topic)

        # 3. Get or create test subtopic
        subtopic = db.query(SubTopic).filter(SubTopic.topic_id == topic.id, SubTopic.name == "if-else Statements").first()
        if not subtopic:
            subtopic = SubTopic(topic_id=topic.id, name="if-else Statements", description="Conditional branch statements")
            db.add(subtopic)
            db.commit()
            db.refresh(subtopic)

        # 4. Create question with options
        question = Question(
            subtopic_id=subtopic.id,
            question_text="What is the output of `if True: print('Yes')`?",
            explanation="`if True:` evaluates to boolean True, so the indented print block runs.",
            difficulty="easy",
        )
        db.add(question)
        db.flush()

        opt1 = QuestionOption(question_id=question.id, option_text="Yes", is_correct=True)
        opt2 = QuestionOption(question_id=question.id, option_text="No", is_correct=False)
        opt3 = QuestionOption(question_id=question.id, option_text="Error", is_correct=False)
        db.add_all([opt1, opt2, opt3])
        db.commit()
        db.refresh(question)

        print(f"✅ Question created successfully! ID: {question.id}")
        print(f"Text: {question.question_text}")
        print(f"Options ({len(question.options)}):")
        for opt in question.options:
            print(f"  - {opt.option_text} (Correct: {opt.is_correct})")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during question creation: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    test_question_flow()
