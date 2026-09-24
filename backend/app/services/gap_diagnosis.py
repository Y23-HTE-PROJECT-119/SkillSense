from typing import Dict, List, Tuple
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.assessment import Assessment, LearnerResponse
from app.db.models.question import Question
from app.db.models.subtopic import SubTopic
from app.db.models.subtopic_performance import SubTopicPerformance
from app.db.models.topic import Topic
from app.db.schemas.gap_analysis import SkillGapAnalysisResponse, SubTopicGapDetail


def evaluate_and_persist_gaps(
    assessment_id: int,
    db: Session,
) -> SkillGapAnalysisResponse:
    """
    Analyzes learner responses for an assessment, calculates accuracy per subtopic,
    determines severity/confidence, stores SubTopicPerformance records,
    and returns a comprehensive SkillGapAnalysisResponse.
    """
    assessment = db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    ).scalar_one_or_none()

    if not assessment:
        raise ValueError("Assessment session not found.")

    responses = db.scalars(
        select(LearnerResponse).where(LearnerResponse.assessment_id == assessment_id)
    ).all()

    # Group responses by subtopic_id
    subtopic_stats: Dict[int, Tuple[int, int]] = {}  # subtopic_id -> (total, correct)
    
    for r in responses:
        q = db.execute(
            select(Question).where(Question.id == r.question_id)
        ).scalar_one_or_none()
        if q:
            total, correct = subtopic_stats.get(q.subtopic_id, (0, 0))
            new_total = total + 1
            new_correct = correct + (1 if r.is_correct else 0)
            subtopic_stats[q.subtopic_id] = (new_total, new_correct)

    strong_subtopics: List[str] = []
    weak_subtopics: List[str] = []
    diagnoses: List[SubTopicGapDetail] = []

    for subtopic_id, (total, correct) in subtopic_stats.items():
        subtopic = db.execute(
            select(SubTopic).where(SubTopic.id == subtopic_id)
        ).scalar_one_or_none()

        if not subtopic:
            continue

        topic = db.execute(
            select(Topic).where(Topic.id == subtopic.topic_id)
        ).scalar_one_or_none()
        topic_name = topic.name if topic else "General"

        accuracy = (correct / total * 100.0) if total > 0 else 0.0

        if accuracy < 50.0:
            status_str = "critical"
            severity_str = "high"
            weak_subtopics.append(subtopic.name)
            evidence = f"Critical gap: Answered {correct} out of {total} questions correctly ({accuracy:.0f}% accuracy)."
        elif accuracy < 75.0:
            status_str = "weak"
            severity_str = "medium"
            weak_subtopics.append(subtopic.name)
            evidence = f"Moderate gap: Answered {correct} out of {total} questions correctly ({accuracy:.0f}% accuracy)."
        else:
            status_str = "proficient"
            severity_str = "low"
            strong_subtopics.append(subtopic.name)
            evidence = f"Proficient: Answered {correct} out of {total} questions correctly ({accuracy:.0f}% accuracy)."

        # Upsert SubTopicPerformance record
        perf = db.execute(
            select(SubTopicPerformance).where(
                SubTopicPerformance.assessment_id == assessment_id,
                SubTopicPerformance.subtopic_id == subtopic_id,
            )
        ).scalar_one_or_none()

        if perf:
            perf.total_questions = total
            perf.correct_answers = correct
            perf.accuracy_percentage = round(accuracy, 2)
            perf.status = status_str
            perf.severity = severity_str
        else:
            perf = SubTopicPerformance(
                assessment_id=assessment_id,
                subtopic_id=subtopic_id,
                total_questions=total,
                correct_answers=correct,
                accuracy_percentage=round(accuracy, 2),
                status=status_str,
                severity=severity_str,
            )
            db.add(perf)

        diagnoses.append(
            SubTopicGapDetail(
                subtopic_id=subtopic.id,
                subtopic_name=subtopic.name,
                topic_name=topic_name,
                total_questions=total,
                correct_answers=correct,
                accuracy_percentage=round(accuracy, 2),
                status=status_str,
                severity=severity_str,
                evidence_summary=evidence,
            )
        )

    db.commit()

    overall_pct = (
        (assessment.total_score / assessment.max_score * 100.0)
        if assessment.max_score and assessment.max_score > 0
        else 0.0
    )

    return SkillGapAnalysisResponse(
        assessment_id=assessment.id,
        skill_id=assessment.skill_id,
        skill_name=assessment.skill.name if assessment.skill else "Skill Assessment",
        overall_percentage=round(overall_pct, 2),
        status=assessment.status,
        completed_at=assessment.completed_at or assessment.created_at,
        strong_subtopics=strong_subtopics,
        weak_subtopics=weak_subtopics,
        diagnoses=diagnoses,
    )
