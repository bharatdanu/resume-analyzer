from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from .utils import extract_resume_text
from .api_settings import analyze_resume_with_ai


class AnalyzeResumeView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        resume_file = request.FILES.get("resume")

        if not resume_file:
            return Response(
                {"error": "Resume file is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            resume_text = extract_resume_text(resume_file)
            analysis = analyze_resume_with_ai(resume_text)

            return Response({"analysis": analysis})

        except ValueError as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {"error": "Resume analysis failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
