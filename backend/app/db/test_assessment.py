from app.db.database import SessionLocal, create_tables
from app.db.models.skill import Skill
from app.db.models.topic import Topic
from app.db.models.subtopic import SubTopic
from app.db.models.question import Question, QuestionOption
from app.db.models.assessment import Assessment, AssessmentQuestion, LearnerResponse


def test_assessment_engine_flow():
    # Ensure tables exist
    create_tables()

    db = SessionLocal()
    try:
        # 1. Fetch test skill
        skill = db.query(Skill).filter(Skill.name == "Python Basics").first()
        if not skill:
            print("⚠️ No skill found. Creating test Skill, Topic, SubTopic, Question...")
            skill = Skill(name="Python Basics", description="Python Fundamentals")
            db.add(skill)
            db.commit()
            db.refresh(skill)

            topic = Topic(skill_id=skill.id, name="Control Flow", description="Loops and conditionals")
            db.add(topic)
            db.commit()
            db.refresh(topic)

            subtopic = SubTopic(topic_id=topic.id, name="if-else Statements", description="Conditionals")
            db.add(subtopic)
            db.commit()
            db.refresh(subtopic)

            q = Question(
                subtopic_id=subtopic.id,
                question_text="What is the output of `if True: print('SkillSense')`?",
                explanation="Evaluates to True, so print statement executes.",
                difficulty="easy",
            )
            db.add(q)
            db.flush()

            opt1 = QuestionOption(question_id=q.id, option_text="SkillSense", is_correct=True)
            opt2 = QuestionOption(question_id=q.id, option_text="None", is_correct=False)
            db.add_all([opt1, opt2])
            db.commit()

        # 2. Create Assessment Session
        assessment = Assessment(
            skill_id=skill.id,
            title=f"{skill.name} Diagnostic Assessment Test",
            status="in_progress",
        )
        db.add(assessment)
        db.flush()

        # Fetch questions under skill
        questions = (
            db.query(Question)
            .join(SubTopic, Question.subtopic_id == SubTopic.id)
            .join(Topic, SubTopic.topic_id == Topic.id)
            .filter(Topic.skill_id == skill.id)
            .all()
        )

        for q in questions:
            aq = AssessmentQuestion(assessment_id=assessment.id, question_id=q.id)
            db.add(aq)

        db.commit()
        db.refresh(assessment)

        print(f"✅ Created Assessment Session ID: {assessment.id} (Title: '{assessment.title}')")
        print(f"Status: {assessment.status}")
        print(f"Questions Linked: {len(questions)}")

        # 3. Simulate Learner Answers & Scoring
        total_score = 0.0
        for q in questions:
            correct_opt = next((o for o in q.options if o.is_correct), None)
            selected_opt_id = correct_opt.id if correct_opt else None
            is_correct = True if correct_opt else False

            if is_correct:
                total_score += 1.0

            response = LearnerResponse(
                assessment_id=assessment.id,
                question_id=q.id,
                selected_option_id=selected_opt_id,
                is_correct=is_correct,
            )
            db.add(response)

        assessment.status = "completed"
        assessment.total_score = total_score
        assessment.max_score = float(len(questions))

        db.commit()
        db.refresh(assessment)

        print(f"\n✅ Assessment Completed Successfully!")
        print(f"Final Score: {assessment.total_score} / {assessment.max_score} ({(assessment.total_score / assessment.max_score * 100):.1f}%)")
        print(f"Status: {assessment.status}")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during Assessment Engine test: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    test_assessment_engine_flow()
