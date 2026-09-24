from app.db.database import SessionLocal, create_tables
from app.db.models.skill import Skill
from app.db.models.topic import Topic
from app.db.models.subtopic import SubTopic
from app.db.models.learning_material import LearningMaterial
from app.db.models.question import Question, QuestionOption
from app.services.ai_generator import generate_questions_for_subtopic


def seed_database():
    create_tables()
    db = SessionLocal()
    try:
        # 1. Python Basics Skill
        python_skill = db.query(Skill).filter(Skill.name == "Python Basics").first()
        if not python_skill:
            python_skill = Skill(name="Python Basics", description="Core Python programming language fundamentals.")
            db.add(python_skill)
            db.commit()
            db.refresh(python_skill)

        # Topic 1: Variables & Data Types
        topic1 = db.query(Topic).filter(Topic.skill_id == python_skill.id, Topic.name == "Variables & Data Types").first()
        if not topic1:
            topic1 = Topic(skill_id=python_skill.id, name="Variables & Data Types", description="Primitive types, casting, and variables.")
            db.add(topic1)
            db.commit()
            db.refresh(topic1)

        sub1 = db.query(SubTopic).filter(SubTopic.topic_id == topic1.id, SubTopic.name == "Variables & Assignment").first()
        if not sub1:
            sub1 = SubTopic(topic_id=topic1.id, name="Variables & Assignment", description="Assigning values and variable names.")
            db.add(sub1)
            db.commit()
            db.refresh(sub1)

            mat1 = LearningMaterial(
                subtopic_id=sub1.id,
                title="Python Variable Assignment",
                description="Variables in Python are created when you assign a value using '=' operator.",
                source_type="markdown",
            )
            db.add(mat1)
            db.commit()

        # Topic 2: Control Flow
        topic2 = db.query(Topic).filter(Topic.skill_id == python_skill.id, Topic.name == "Control Flow").first()
        if not topic2:
            topic2 = Topic(skill_id=python_skill.id, name="Control Flow", description="Conditionals and loops.")
            db.add(topic2)
            db.commit()
            db.refresh(topic2)

        sub2 = db.query(SubTopic).filter(SubTopic.topic_id == topic2.id, SubTopic.name == "if-else Statements").first()
        if not sub2:
            sub2 = SubTopic(topic_id=topic2.id, name="if-else Statements", description="Conditional branching.")
            db.add(sub2)
            db.commit()
            db.refresh(sub2)

        # Generate questions if subtopics have 0 questions
        subtopics_to_check = db.query(SubTopic).join(Topic).filter(Topic.skill_id == python_skill.id).all()
        for sub in subtopics_to_check:
            q_count = db.query(Question).filter(Question.subtopic_id == sub.id).count()
            if q_count == 0:
                print(f"Generating AI questions for subtopic '{sub.name}'...")
                q_payloads = generate_questions_for_subtopic(sub.name, sub.description, count=3)
                for q_data in q_payloads:
                    q = Question(
                        subtopic_id=sub.id,
                        question_text=q_data.question_text,
                        explanation=q_data.explanation,
                        difficulty=q_data.difficulty,
                    )
                    db.add(q)
                    db.flush()
                    for opt in q_data.options:
                        db.add(QuestionOption(question_id=q.id, option_text=opt.option_text, is_correct=opt.is_correct))
                db.commit()

        print("✅ Database successfully seeded!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during seeding: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
