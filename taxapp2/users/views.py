from django.contrib.auth import update_session_auth_hash, authenticate
from django.contrib.auth.models import Group
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_201_CREATED, HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin, DestroyModelMixin, UpdateModelMixin

# from rest_framework.request import Request
# from rest_framework.exceptions import PermissionDenied
# from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
# from django.core.mail import send_mail
from .models import User
from .permissions import (
    IsSupervisor1, 
    IsSupervisor2
)
from .serializers import (
    UserSerializer, 
    CreateUserSerializer,
    ChangePasswordSerializer,
    GroupSerializer,
)

class CurrentUserViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            serializeData = UserSerializer(request.user)
            return Response(serializeData.data)
        else:
            return Response({'error': 'You are not authenticated.'}, status=401)

    queryset = User.objects.none()
    serializer_class = UserSerializer

class UserCreateView(APIView):
    serializer_class = CreateUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=HTTP_201_CREATED)


class UserViewSet(GenericAPIView, ListModelMixin, UpdateModelMixin, DestroyModelMixin):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request):
        """"
        Get request does not require any ID. the endpoint returns all users
        """
        return self.list(request)

    def put(self, request, pk):
        instance = self.get_object()  # Get the user instance by pk
        serializer = self.get_serializer(instance, data=request.data, partial=True)  # Serialize the instance with the request data
        serializer.is_valid(raise_exception=True)  # Validate the serializer data
        serializer.save()  # Save the serializer data
        return self.partial_update(request, pk)

    def delete(self, request, pk):
        return self.destroy(request, pk)


class ChangePasswordView(APIView):
    """
    parameter: old_password, new_password1, new_password2 
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        old_password = serializer.data['old_password']
        new_password = serializer.data['new_password1']

        if not authenticate(username=user.username, password=old_password):
            return Response({'error': 'Invalid old password'}, status=HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(self.request, user)

        return Response({'message': 'Password changed successfully'}, status=HTTP_200_OK)



class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated, IsSupervisor1]