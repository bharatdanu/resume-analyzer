from django.urls import path
from .views import AnalyzeResumeView


urlpatterns = [
    path("analyze-resume/", AnalyzeResumeView.as_view(), name="analyze-resume"),
]
