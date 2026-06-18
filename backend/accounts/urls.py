from django.urls import path
from .views import testapi
urlpatterns = [
    path('testapi/',testapi.as_view()),
]
