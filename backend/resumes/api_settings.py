import json
import logging

from django.conf import settings
from openai import APIConnectionError, APIStatusError, AuthenticationError, OpenAI


logger = logging.getLogger(__name__)

ANALYSIS_LIST_FIELDS = ("strengths", "weaknesses", "improvements", "skills_detected")


class ResumeAnalysisServiceError(Exception):
    """A safe error shown when the AI service cannot analyze a resume."""


def _get_client():
    api_key = settings.GROQ_API_KEY
    if not api_key or api_key.startswith("replace-with"):
        raise ResumeAnalysisServiceError(
            "Resume analysis is not configured. Add a valid GROQ_API_KEY to "
            "backend/.env, then restart the Django server."
        )
    return OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")


def _parse_analysis(content):
    """Normalize an LLM response into the shape expected by the frontend."""
    cleaned_content = content.strip()

    # Models occasionally wrap otherwise valid JSON in a Markdown fence.
    if cleaned_content.startswith("```") and cleaned_content.endswith("```"):
        cleaned_content = cleaned_content.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    try:
        analysis = json.loads(cleaned_content)
    except json.JSONDecodeError as error:
        logger.warning("Groq returned non-JSON analysis: %s", content[:200])
        raise ResumeAnalysisServiceError(
            "The AI analysis service returned an invalid response. Please try again."
        ) from error

    if not isinstance(analysis, dict) or not isinstance(analysis.get("summary"), str):
        raise ResumeAnalysisServiceError("The AI analysis service returned an invalid response. Please try again.")

    for field in ANALYSIS_LIST_FIELDS:
        if not isinstance(analysis.get(field), list):
            analysis[field] = []

    try:
        analysis["ats_score"] = max(0, min(100, round(float(analysis.get("ats_score", 0)))))
    except (TypeError, ValueError):
        analysis["ats_score"] = 0

    return analysis


def analyze_resume_with_ai(resume_text):
    prompt = f"""
You are an expert ATS resume reviewer.

Analyze the resume and return ONLY valid JSON in this format:

{{
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "improvements": [],
  "skills_detected": [],
  "ats_score": 0
}}

Resume:
{resume_text}
"""

    try:
        response = _get_client().chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": "Return only a valid JSON object."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
            max_tokens=2048,
        )
    except AuthenticationError as error:
        logger.warning("Groq authentication failed: %s", error)
        raise ResumeAnalysisServiceError(
            "The configured GROQ_API_KEY is invalid or has expired. Update "
            "backend/.env and restart the Django server."
        ) from error
    except APIConnectionError as error:
        logger.exception("Could not connect to Groq")
        raise ResumeAnalysisServiceError(
            "The AI analysis service is temporarily unavailable. Please try again shortly."
        ) from error
    except APIStatusError as error:
        logger.exception("Groq returned an API error")
        raise ResumeAnalysisServiceError(
            "The AI analysis service could not process this request. Please try again shortly."
        ) from error

    content = response.choices[0].message.content
    if not content:
        raise ResumeAnalysisServiceError("The AI analysis service returned an empty response. Please try again.")

    return _parse_analysis(content)
