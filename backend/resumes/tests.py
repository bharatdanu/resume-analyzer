from django.test import SimpleTestCase

from .api_settings import _parse_analysis


class AnalysisParsingTests(SimpleTestCase):
    def test_parses_json_wrapped_in_a_markdown_fence(self):
        result = _parse_analysis(
            '```json\n{"summary": "Good candidate", "strengths": ["Python"], '
            '"weaknesses": [], "improvements": [], "skills_detected": ["Django"], '
            '"ats_score": 73}\n```'
        )

        self.assertEqual(result["summary"], "Good candidate")
        self.assertEqual(result["ats_score"], 73)

    def test_normalizes_missing_optional_list_fields(self):
        result = _parse_analysis('{"summary": "Good candidate", "ats_score": "82"}')

        self.assertEqual(result["ats_score"], 82)
        self.assertEqual(result["strengths"], [])

# Create your tests here.
