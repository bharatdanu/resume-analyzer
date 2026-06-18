from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes
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

@authentication_classes([JWTAuthentication])
class testapi(APIView):
    def get(self, request, *args, **kwargs):
        return Response("hello world")