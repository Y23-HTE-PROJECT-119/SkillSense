from datetime import datetime
from sqlalchemy import select
from app.db.database import SessionLocal, create_tables
from app.db.models.assessment import Assessment, AssessmentQuestion, LearnerResponse
from app.db.models.learning_material import LearningMaterial
from app.db.models.question import Question, QuestionOption
from app.db.models.skill import Skill
from app.db.models.subtopic import SubTopic
from app.db.models.topic import Topic
from app.services.ai_generator import generate_questions_for_subtopic
from app.services.gap_diagnosis import evaluate_and_persist_gaps
from app.services.mastery_engine import create_targeted_retest, update_mastery_records, get_skill_mastery_overview
from app.services.weakness_explainer import generate_remediation_for_assessment


def run_complete_end_to_end_test():
    print("=" * 70)
    print("🚀 RUNNING COMPLETE SKILLSENSE END-TO-END PIPELINE VERIFICATION")
    print("=" * 70)

    create_tables()
    db = SessionLocal()

    try:
        # Step 1: Create Skill Hierarchy
        print("\n--- STEP 1: Skill Hierarchy & Learning Material Ingestion ---")
        skill_name = f"ML Core {datetime.utcnow().strftime('%H%M%S')}"
        skill = Skill(name=skill_name, description="Core ML Algorithms and Concepts")
        db.add(skill)
        db.commit()
        db.refresh(skill)

        topic = Topic(skill_id=skill.id, name="Supervised Learning", description="Classification and Regression")
        db.add(topic)
        db.commit()
        db.refresh(topic)

        subtopic1 = SubTopic(topic_id=topic.id, name="Linear Regression", description="Continuous output prediction")
        subtopic2 = SubTopic(topic_id=topic.id, name="Decision Trees", description="Tree-based decision rules")
        db.add_all([subtopic1, subtopic2])
        db.commit()
        db.refresh(subtopic1)
        db.refresh(subtopic2)

        mat = LearningMaterial(
            subtopic_id=subtopic1.id,
            title="Linear Regression Fundamentals",
            description="Linear Regression models relationship using y = mx + c with Ordinary Least Squares.",
            source_type="markdown",
        )
        db.add(mat)
        db.commit()
        print(f"Created Skill: '{skill.name}' -> Topic: '{topic.name}' -> SubTopics: '{subtopic1.name}', '{subtopic2.name}'")

        # Step 2: AI Question Generation
        print("\n--- STEP 2: AI Question Generation ---")
        q_list1 = generate_questions_for_subtopic(subtopic1.name, subtopic1.description, count=2)
        q_list2 = generate_questions_for_subtopic(subtopic2.name, subtopic2.description, count=2)

        db_questions = []
        for q_data in (q_list1 + q_list2):
            q = Question(
                subtopic_id=subtopic1.id if q_data in q_list1 else subtopic2.id,
                question_text=q_data.question_text,
                explanation=q_data.explanation,
                difficulty=q_data.difficulty,
            )
            db.add(q)
            db.flush()
            for opt in q_data.options:
                db.add(QuestionOption(question_id=q.id, option_text=opt.option_text, is_correct=opt.is_correct))
            db_questions.append(q)
        db.commit()
        print(f"Generated and saved {len(db_questions)} MCQs in MySQL database.")

        # Step 3: Create & Submit Initial Assessment (Simulate 1 Correct, 1 Incorrect to force gap)
        print("\n--- STEP 3: Initial Assessment Session & Submission ---")
        assessment = Assessment(skill_id=skill.id, title="ML Diagnostics Initial Test", status="in_progress")
        db.add(assessment)
        db.flush()

        for q in db_questions:
            db.add(AssessmentQuestion(assessment_id=assessment.id, question_id=q.id))

        total_score = 0.0
        for idx, q in enumerate(db_questions):
            # Intentionally fail questions for subtopic2 (Decision Trees)
            if q.subtopic_id == subtopic2.id:
                wrong_opt = next((o for o in q.options if not o.is_correct), None)
                sel_id = wrong_opt.id if wrong_opt else None
                is_corr = False
            else:
                right_opt = next((o for o in q.options if o.is_correct), None)
                sel_id = right_opt.id if right_opt else None
                is_corr = True
                total_score += 1.0

            db.add(LearnerResponse(assessment_id=assessment.id, question_id=q.id, selected_option_id=sel_id, is_correct=is_corr))

        assessment.status = "completed"
        assessment.total_score = total_score
        assessment.max_score = float(len(db_questions))
        db.commit()
        db.refresh(assessment)

        update_mastery_records(assessment.id, db)
        print(f"Submitted Initial Assessment! Score: {assessment.total_score} / {assessment.max_score} ({(total_score / len(db_questions) * 100):.0f}%)")

        # Step 4: Sub-topic Gap Diagnosis
        print("\n--- STEP 4: Sub-topic Gap Diagnosis ---")
        gap_report = evaluate_and_persist_gaps(assessment.id, db)
        print(f"Strong SubTopics: {gap_report.strong_subtopics}")
        print(f"Weak SubTopics Diagnosed: {gap_report.weak_subtopics}")

        # Step 5: Weakness Explanation & Remediation
        print("\n--- STEP 5: Weakness Remediation Lessons ---")
        remediation = generate_remediation_for_assessment(assessment.id, db)
        for exp in remediation.explanations:
            print(f"🎯 Remediation for '{exp.subtopic_name}':")
            print(f"   Concept: {exp.concept_explanation}")
            print(f"   Correct Rule: {exp.correct_concept}")

        # Step 6: Targeted Re-test Generation
        print("\n--- STEP 6: Targeted Re-Test Generation ---")
        retest_info = create_targeted_retest(assessment.id, db)
        retest_id = retest_info.retest_assessment.id
        print(f"Generated Targeted Retest ID #{retest_id} targeting: {retest_info.target_weak_subtopics}")

        # Step 7: Submit Re-test with Correct Answers
        print("\n--- STEP 7: Re-test Submission & Mastery Calculation ---")
        retest_assessment = db.execute(select(Assessment).where(Assessment.id == retest_id)).scalar_one_or_none()
        
        retest_qs = (
            db.query(Question)
            .join(AssessmentQuestion, AssessmentQuestion.question_id == Question.id)
            .filter(AssessmentQuestion.assessment_id == retest_id)
            .all()
        )

        r_score = 0.0
        for q in retest_qs:
            right_opt = next((o for o in q.options if o.is_correct), None)
            db.add(LearnerResponse(assessment_id=retest_id, question_id=q.id, selected_option_id=right_opt.id if right_opt else None, is_correct=True))
            r_score += 1.0

        retest_assessment.status = "completed"
        retest_assessment.total_score = r_score
        retest_assessment.max_score = float(len(retest_qs))
        db.commit()

        update_mastery_records(retest_id, db)
        print(f"Retest Submitted Successfully! Score: {retest_assessment.total_score} / {retest_assessment.max_score} (100%)")

        # Step 8: Final Mastery Overview Verification
        print("\n--- STEP 8: Final Skill Mastery Overview ---")
        mastery_overview = get_skill_mastery_overview(skill.id, db)
        print(f"Skill: {mastery_overview.skill_name}")
        print(f"Overall Mastery: {mastery_overview.overall_mastery_percentage}%")
        print(f"Mastered SubTopics: {mastery_overview.mastered_subtopics_count} / {mastery_overview.total_subtopics_count}")
        for r in mastery_overview.records:
            print(f"  - {r.subtopic_name}: {r.mastery_score}% ({r.mastery_level.upper()}) | Attempts: {r.attempts_count}")

        print("\n" + "=" * 70)
        print("🎉 COMPLETE END-TO-END PIPELINE VERIFIED SUCCESSFULLY!")
        print("=" * 70)

    except Exception as e:
        db.rollback()
        print(f"❌ Error during End-to-End test: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    run_complete_end_to_end_test()
