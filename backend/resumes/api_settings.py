import os
import json
from openai import OpenAI

# Groq client (OpenAI-compatible)
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

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
  "ats_score": 0,
  "job_match_score": 0
}}

Resume:
{resume_text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "Return ONLY valid JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except:
        # fallback if JSON breaks
        return {
            "summary": content,
            "strengths": [],
            "weaknesses": [],
            "improvements": [],
            "skills_detected": [],
            "ats_score": 50,
            "job_match_score": 50
        }