from datetime import datetime
from typing import List, Tuple
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.assessment import Assessment, AssessmentQuestion, LearnerResponse
from app.db.models.mastery import MasteryRecord
from app.db.models.question import Question, QuestionOption
from app.db.models.subtopic import SubTopic
from app.db.models.topic import Topic
from app.db.schemas.assessment import PublicOptionResponse, PublicQuestionResponse, AssessmentSessionResponse
from app.db.schemas.mastery import MasteryOverviewResponse, MasteryRecordResponse, RetestResponse
from app.services.ai_generator import generate_questions_for_subtopic
from app.services.gap_diagnosis import evaluate_and_persist_gaps


def create_targeted_retest(
    assessment_id: int,
    db: Session,
) -> RetestResponse:
    """
    Creates a new targeted re-test session focused exclusively on weak/critical subtopics
    from a previous assessment.
    """
    gap_report = evaluate_and_persist_gaps(assessment_id, db)

    weak_subtopic_ids = [
        d.subtopic_id for d in gap_report.diagnoses if d.status in ("weak", "critical")
    ]
    target_names = [
        d.subtopic_name for d in gap_report.diagnoses if d.status in ("weak", "critical")
    ]

    if not weak_subtopic_ids:
        # If no weak areas, include all subtopics for reinforcement
        weak_subtopic_ids = [d.subtopic_id for d in gap_report.diagnoses]
        target_names = [d.subtopic_name for d in gap_report.diagnoses]

    # Generate new targeted questions for each weak subtopic
    new_questions: List[Question] = []
    for sub_id in weak_subtopic_ids:
        subtopic = db.execute(
            select(SubTopic).where(SubTopic.id == sub_id)
        ).scalar_one_or_none()

        if not subtopic:
            continue

        q_payloads = generate_questions_for_subtopic(
            subtopic_name=subtopic.name,
            subtopic_description=subtopic.description,
            count=2,
            difficulty="medium",
        )

        for q_data in q_payloads:
            q = Question(
                subtopic_id=sub_id,
                question_text=f"[Retest] {q_data.question_text}",
                explanation=q_data.explanation,
                difficulty=q_data.difficulty,
            )
            db.add(q)
            db.flush()

            for opt in q_data.options:
                db.add(
                    QuestionOption(
                        question_id=q.id,
                        option_text=opt.option_text,
                        is_correct=opt.is_correct,
                    )
                )
            new_questions.append(q)

    # Create new retest assessment session
    retest_assessment = Assessment(
        skill_id=gap_report.skill_id,
        title=f"Targeted Retest - {gap_report.skill_name}",
        status="in_progress",
    )
    db.add(retest_assessment)
    db.flush()

    for q in new_questions:
        db.add(
            AssessmentQuestion(
                assessment_id=retest_assessment.id,
                question_id=q.id,
            )
        )

    db.commit()
    db.refresh(retest_assessment)

    public_questions = []
    for q in new_questions:
        pub_options = [
            PublicOptionResponse(id=opt.id, option_text=opt.option_text)
            for opt in q.options
        ]
        public_questions.append(
            PublicQuestionResponse(
                id=q.id,
                subtopic_id=q.subtopic_id,
                question_text=q.question_text,
                difficulty=q.difficulty,
                options=pub_options,
            )
        )

    session_resp = AssessmentSessionResponse(
        id=retest_assessment.id,
        skill_id=retest_assessment.skill_id,
        title=retest_assessment.title,
        status=retest_assessment.status,
        created_at=retest_assessment.created_at,
        questions=public_questions,
    )

    return RetestResponse(
        original_assessment_id=assessment_id,
        retest_assessment=session_resp,
        target_weak_subtopics=target_names,
        message=f"Targeted re-test generated with {len(new_questions)} fresh questions focusing on weak subtopics.",
    )


def update_mastery_records(
    assessment_id: int,
    db: Session,
):
    """
    Evaluates learner accuracy per subtopic upon submission and updates MasteryRecords.
    """
    responses = db.scalars(
        select(LearnerResponse).where(LearnerResponse.assessment_id == assessment_id)
    ).all()

    subtopic_stats = {}
    for r in responses:
        q = db.execute(
            select(Question).where(Question.id == r.question_id)
        ).scalar_one_or_none()
        if q:
            sub_id = q.subtopic_id
            tot, corr = subtopic_stats.get(sub_id, (0, 0))
            subtopic_stats[sub_id] = (tot + 1, corr + (1 if r.is_correct else 0))

    for sub_id, (tot, corr) in subtopic_stats.items():
        accuracy = (corr / tot * 100.0) if tot > 0 else 0.0

        if accuracy >= 85.0:
            level = "mastered"
        elif accuracy >= 70.0:
            level = "proficient"
        elif accuracy >= 50.0:
            level = "learning"
        else:
            level = "novice"

        record = db.execute(
            select(MasteryRecord).where(MasteryRecord.subtopic_id == sub_id)
        ).scalar_one_or_none()

        if record:
            record.mastery_score = round(accuracy, 2)
            record.mastery_level = level
            record.attempts_count += 1
            record.last_evaluated_at = datetime.utcnow()
        else:
            record = MasteryRecord(
                subtopic_id=sub_id,
                mastery_score=round(accuracy, 2),
                mastery_level=level,
                attempts_count=1,
                last_evaluated_at=datetime.utcnow(),
            )
            db.add(record)

    db.commit()


def get_skill_mastery_overview(
    skill_id: int,
    db: Session,
) -> MasteryOverviewResponse:
    """Calculates overall skill mastery metrics across all subtopics under a skill."""
    topics = db.scalars(
        select(Topic).where(Topic.skill_id == skill_id)
    ).all()
    topic_ids = [t.id for t in topics]

    subtopics = db.scalars(
        select(SubTopic).where(SubTopic.topic_id.in_(topic_ids))
    ).all() if topic_ids else []

    records: List[MasteryRecordResponse] = []
    total_score_sum = 0.0
    mastered_count = 0

    for s in subtopics:
        rec = db.execute(
            select(MasteryRecord).where(MasteryRecord.subtopic_id == s.id)
        ).scalar_one_or_none()

        topic_name = s.topic.name if s.topic else "General"
        score = rec.mastery_score if rec else 0.0
        level = rec.mastery_level if rec else "novice"
        attempts = rec.attempts_count if rec else 0
        last_eval = rec.last_evaluated_at if rec else datetime.utcnow()

        if level == "mastered":
            mastered_count += 1

        total_score_sum += score

        records.append(
            MasteryRecordResponse(
                subtopic_id=s.id,
                subtopic_name=s.name,
                topic_name=topic_name,
                mastery_score=score,
                mastery_level=level,
                attempts_count=attempts,
                last_evaluated_at=last_eval,
            )
        )

    overall_pct = (total_score_sum / len(subtopics)) if subtopics else 0.0

    return MasteryOverviewResponse(
        skill_id=skill_id,
        skill_name=topics[0].skill.name if topics and topics[0].skill else "Skill",
        overall_mastery_percentage=round(overall_pct, 2),
        mastered_subtopics_count=mastered_count,
        total_subtopics_count=len(subtopics),
        records=records,
    )
