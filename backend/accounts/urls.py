from django.urls import path
from .views import ForgotPasswordView, testapi

urlpatterns = [
    path('forgot-password/', ForgotPasswordView.as_view()),
    path('testapi/',testapi.as_view()),
]
