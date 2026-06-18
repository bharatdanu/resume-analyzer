from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
# Create your views here.

class UserModelViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['post']

class UserProfile(ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    http_method_names = ['get','patch']
    
    # get_queryset return array of objects that are fetched from db
    def get_queryset(self):                # restrict exposure of other users using url with user_id
        return User.objects.filter(id=self.request.user.id)

    # return list of objects or single . means how to show fetched data from db
    def list(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class ForgotPasswordView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get("username", "").strip()
        email = request.data.get("email", "").strip()
        new_password = request.data.get("new_password", "")

        if not username or not email or not new_password:
            return Response(
                {"error": "Username, email, and new password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(username=username, email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "No account found with the provided username and email."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            validate_password(new_password, user)
        except ValidationError as error:
            return Response(
                {"error": list(error.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successfully."})

@authentication_classes([JWTAuthentication])
class testapi(APIView):
    def get(self, request, *args, **kwargs):
        return Response("hello world")
