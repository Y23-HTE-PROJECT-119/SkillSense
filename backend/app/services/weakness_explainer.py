import json
import logging
from typing import List, Optional
import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models.assessment import Assessment, LearnerResponse
from app.db.models.learning_material import LearningMaterial
from app.db.models.question import Question, QuestionOption
from app.db.models.subtopic import SubTopic
from app.db.schemas.remediation import RemediationExplanation, RemediationResponse
from app.services.gap_diagnosis import evaluate_and_persist_gaps

logger = logging.getLogger(__name__)

REMEDIATION_PROMPT = """You are an expert technical tutor and pedagogical specialist.
A learner completed a diagnostic assessment on the topic/sub-topic: "{subtopic_name}".
The learner demonstrated a weakness in this concept.

Incorrect Question Context:
{question_context}

Reference Learning Material Context:
{material_context}

Provide a targeted, grounded, and clear remediation explanation for this learner.

OUTPUT FORMAT:
Return ONLY a valid JSON object matching this schema with NO markdown code block wrappers:
{{
  "concept_explanation": "Explain what this subtopic concept is in simple terms...",
  "misconception_analysis": "Explain why the learner's answer choice was wrong or reflects a common misconception...",
  "correct_concept": "State the precise correct behavioral or syntax rule clearly...",
  "example": "Give a concise, clean code example or scenario illustrating the correct usage...",
  "key_takeaways": [
    "Key rule #1 to remember",
    "Key rule #2 to remember"
  ]
}}
"""


def _generate_fallback_explanation(
    subtopic_name: str,
    incorrect_question_text: Optional[str] = None,
) -> RemediationExplanation:
    """Fallback remediation generator when no LLM API key is present or call fails."""
    return RemediationExplanation(
        subtopic_id=0,
        subtopic_name=subtopic_name,
        concept_explanation=f"`{subtopic_name}` is a core programming component that governs control flow, state, or execution behavior.",
        misconception_analysis=f"Struggling with `{subtopic_name}` usually occurs when mistaking syntax rules, scope boundaries, or order of execution.",
        correct_concept=f"Always verify the syntax definition, expected return/state types, and variable scopes when using `{subtopic_name}`.",
        example=f"# Example usage for {subtopic_name}\nval = 10\nif val > 0:\n    print('Correct pattern for {subtopic_name}')",
        key_takeaways=[
            f"Review standard documentation rules for `{subtopic_name}`.",
            "Test edge cases in local terminal before executing complex logic.",
        ],
        recommended_material=f"Official guide on {subtopic_name}",
    )


def generate_remediation_for_assessment(
    assessment_id: int,
    db: Session,
) -> RemediationResponse:
    assessment = db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    ).scalar_one_or_none()

    if not assessment:
        raise ValueError("Assessment session not found.")

    gap_report = evaluate_and_persist_gaps(assessment_id, db)
    explanations: List[RemediationExplanation] = []

    # Get all incorrect responses for context
    responses = db.scalars(
        select(LearnerResponse).where(
            LearnerResponse.assessment_id == assessment_id,
            LearnerResponse.is_correct == False,
        )
    ).all()

    incorrect_by_subtopic = {}
    for r in responses:
        q = db.execute(
            select(Question).where(Question.id == r.question_id)
        ).scalar_one_or_none()
        if q:
            sub_id = q.subtopic_id
            if sub_id not in incorrect_by_subtopic:
                incorrect_by_subtopic[sub_id] = []
            opt_text = "None"
            if r.selected_option_id:
                opt = db.execute(
                    select(QuestionOption).where(QuestionOption.id == r.selected_option_id)
                ).scalar_one_or_none()
                if opt:
                    opt_text = opt.option_text
            incorrect_by_subtopic[sub_id].append(
                f"Question: {q.question_text}\nLearner Answer: {opt_text}\nExplanation: {q.explanation or ''}"
            )

    # Process each weak subtopic
    for diag in gap_report.diagnoses:
        if diag.status in ("weak", "critical"):
            sub_id = diag.subtopic_id
            subtopic = db.execute(
                select(SubTopic).where(SubTopic.id == sub_id)
            ).scalar_one_or_none()

            q_context = "\n---\n".join(incorrect_by_subtopic.get(sub_id, [])) or "N/A"
            m_context = ""
            if subtopic and subtopic.learning_materials:
                m_context = "\n".join(m.description or m.title for m in subtopic.learning_materials)

            prompt = REMEDIATION_PROMPT.format(
                subtopic_name=diag.subtopic_name,
                question_context=q_context[:1000],
                material_context=m_context[:1000] or "N/A",
            )

            exp_obj = None

            # Try Gemini API if key exists
            if settings.gemini_api_key:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.gemini_api_key}"
                    headers = {"Content-Type": "application/json"}
                    payload = {
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"responseMimeType": "application/json"},
                    }
                    with httpx.Client(timeout=30.0) as client:
                        resp = client.post(url, headers=headers, json=payload)
                        if resp.status_code == 200:
                            data = resp.json()
                            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                            parsed = json.loads(raw_text)
                            exp_obj = RemediationExplanation(
                                subtopic_id=sub_id,
                                subtopic_name=diag.subtopic_name,
                                concept_explanation=parsed["concept_explanation"],
                                misconception_analysis=parsed["misconception_analysis"],
                                correct_concept=parsed["correct_concept"],
                                example=parsed["example"],
                                key_takeaways=parsed["key_takeaways"],
                                recommended_material=f"Study Guide: {diag.subtopic_name}",
                            )
                except Exception as e:
                    logger.warning(f"Gemini API call failed for remediation: {e}")

            if not exp_obj:
                exp_obj = _generate_fallback_explanation(diag.subtopic_name)
                exp_obj.subtopic_id = sub_id

            explanations.append(exp_obj)

    return RemediationResponse(
        assessment_id=assessment.id,
        skill_id=assessment.skill_id,
        skill_name=gap_report.skill_name,
        weak_subtopics_count=len(explanations),
        explanations=explanations,
    )
