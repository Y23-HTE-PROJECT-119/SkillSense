import json
import logging
from typing import List, Optional
import httpx

from app.core.config import settings
from app.db.schemas.question import QuestionCreate, QuestionOptionCreate

logger = logging.getLogger(__name__)


PROMPT_TEMPLATE = """You are an expert technical curriculum developer and diagnostic assessment author.
Your task is to generate {count} high-quality Multiple Choice Questions (MCQs) for the sub-topic: "{subtopic_name}".
Sub-topic Description: {subtopic_description}
Difficulty Level: {difficulty}
{learning_material_context}

REQUIREMENTS FOR EACH QUESTION:
1. Clear question stem testing deep conceptual understanding (not simple memory lookup).
2. Exactly 4 multiple choice options.
3. Exactly ONE option must have "is_correct": true, and the other 3 must have "is_correct": false.
4. Distractor options must reflect common student misconceptions or subtle logical errors.
5. Provide a detailed, pedagogical explanation explaining why the correct answer is right and why the distractors are incorrect.

OUTPUT FORMAT:
Return ONLY a valid JSON array of objects with NO additional text or markdown code blocks.
Each object in the array must strictly match this structure:
[
  {{
    "question_text": "Question text goes here...",
    "explanation": "Detailed explanation goes here...",
    "difficulty": "{difficulty}",
    "options": [
      {{"option_text": "Option A text", "is_correct": true}},
      {{"option_text": "Option B text", "is_correct": false}},
      {{"option_text": "Option C text", "is_correct": false}},
      {{"option_text": "Option D text", "is_correct": false}}
    ]
  }}
]
"""


def _generate_fallback_questions(
    subtopic_name: str,
    count: int,
    difficulty: str,
) -> List[QuestionCreate]:
    """Fallback generator when no LLM API key is configured or API fails."""
    questions = []
    for i in range(1, count + 1):
        questions.append(
            QuestionCreate(
                question_text=f"Which of the following statements accurately describes `{subtopic_name}` (Concept Check #{i})?",
                explanation=f"`{subtopic_name}` is a fundamental concept requiring correct understanding of syntax, semantic rules, and application context.",
                difficulty=difficulty,
                options=[
                    QuestionOptionCreate(
                        option_text=f"It represents the core standard behavioral rule of `{subtopic_name}`.",
                        is_correct=True,
                    ),
                    QuestionOptionCreate(
                        option_text=f"It is a deprecated pattern that causes runtime exceptions in `{subtopic_name}`.",
                        is_correct=False,
                    ),
                    QuestionOptionCreate(
                        option_text=f"It only executes when an explicit global override flag is enabled.",
                        is_correct=False,
                    ),
                    QuestionOptionCreate(
                        option_text=f"It has no operational effect in standard implementations.",
                        is_correct=False,
                    ),
                ],
            )
        )
    return questions


def generate_questions_for_subtopic(
    subtopic_name: str,
    subtopic_description: Optional[str] = "",
    count: int = 3,
    difficulty: str = "medium",
    learning_material_text: Optional[str] = "",
) -> List[QuestionCreate]:
    """
    Generates structured MCQs using Gemini API or OpenAI API if keys are provided,
    otherwise uses fallback rule-based generation.
    """
    material_context = ""
    if learning_material_text:
        material_context = f"Reference Learning Material Context:\n{learning_material_text[:1500]}\n"

    prompt = PROMPT_TEMPLATE.format(
        count=count,
        subtopic_name=subtopic_name,
        subtopic_description=subtopic_description or "N/A",
        difficulty=difficulty,
        learning_material_context=material_context,
    )

    # 1. Try Gemini API if key exists
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
                    return [QuestionCreate(**q) for q in parsed]
        except Exception as e:
            logger.warning(f"Gemini API call failed: {e}. Falling back...")

    # 2. Try OpenAI API if key exists
    if settings.openai_api_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"},
            }
            with httpx.Client(timeout=30.0) as client:
                resp = client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_text = data["choices"][0]["message"]["content"]
                    parsed = json.loads(raw_text)
                    if isinstance(parsed, dict) and "questions" in parsed:
                        parsed = parsed["questions"]
                    return [QuestionCreate(**q) for q in parsed]
        except Exception as e:
            logger.warning(f"OpenAI API call failed: {e}. Falling back...")

    # 3. Fallback generator
    logger.info("Using rule-based question generator fallback.")
    return _generate_fallback_questions(subtopic_name, count, difficulty)
