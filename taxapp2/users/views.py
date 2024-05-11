from django.contrib.auth import update_session_auth_hash, authenticate, get_user_model
from django.contrib.auth.models import Group
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.status import (
    HTTP_201_CREATED, 
    HTTP_200_OK, 
    HTTP_400_BAD_REQUEST,
)
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import (
    ListModelMixin, 
    DestroyModelMixin, 
    UpdateModelMixin,
)
# from rest_framework import serializers
# from rest_framework.request import Request
# from rest_framework.exceptions import PermissionDenied
# from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
# from django.core.mail import send_mail
from django_rest_passwordreset.views import (
    clear_expired_tokens,
    generate_token_for_email, 
    HTTP_IP_ADDRESS_HEADER, 
    HTTP_USER_AGENT_HEADER
    )
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import (
    User,
    State,
    LGA,
    Ward,
)
from .permissions import (
    IsSupervisor1, 
    IsSupervisor2,
)
from .serializers import (
    UserSerializer, 
    CreateUserSerializer,
    ChangePasswordSerializer,
    GroupSerializer,
    CustomEmailSerializer,
    StateSerializer,
    LGASerializer,
    WardSerializer,

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
    body: old_password, new_password1, new_password2 
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
    """
    This API provides a comprehensive set of endpoints for managing groups within the system. "
                "All endpoints require authentication with admin privileges. Here's a summary of the functionalities provided: "
                "\n  - **GET ;Listing Groups:** Retrieve a list of all groups in the system. "
                "\n  - **POST ;Creating Groups:** Create a new group with the provided name. "
                "\n  - **GET/ID ;Retrieving Groups:** Get detailed information about a specific group by its ID. "
                "\n  - **PUT ;Updating Groups:** Modify the name or other relevant attributes of an existing group. "
                "\n  - **DEL ;Deleting Groups:** Permanently remove a group from the system. "
                "\nCommon response codes include: "
                "- 200: Successful operation."
                "- 400: Bad request (e.g., validation errors, invalid data format)."
                "- 401: Unauthorized access (missing authentication credentials or invalid credentials)."
                "- 403: Permission denied (user lacks necessary privileges)."
                "- 404: Not Found (resource with the provided ID does not exist)."
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdminUser]
    


class CustomResetPasswordRequestToken(GenericAPIView):
    serializer_class = CustomEmailSerializer
    permission_classes = ()
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        

        email = serializer.validated_data['email']
        user_model = get_user_model()

        # Check if user exists with the provided email
        try:
            user = user_model.objects.get(email=email)
        except user_model.DoesNotExist:
            return Response({'error': 'Email address not found'}, status=HTTP_400_BAD_REQUEST)

        clear_expired_tokens()  
        token = generate_token_for_email(
            email=email,
            user_agent=request.META.get(HTTP_USER_AGENT_HEADER, ''),
            ip_address=request.META.get(HTTP_IP_ADDRESS_HEADER, ''),
        )

        return Response({
            'token': token.key,
            'reset_password_url': "{}?token={}".format(
            request.build_absolute_uri(reverse('password_reset:reset-password-confirm')),
            token.key),
        })


class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer
    filter_fields = ('name',)  
    permission_classes = [IsSupervisor1, IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Add custom filtering based on request.GET parameters (optional)
        return queryset


class LGASViewSet(viewsets.ModelViewSet):
    queryset = LGA.objects.select_related('state').all()  # Pre-fetch related state data
    serializer_class = LGASerializer
    filter_fields = ('name', 'code', 'state__name')  # Allow filtering by name, code, and state name

    def get_queryset(self):
        queryset = super().get_queryset()
        # Add custom filtering based on request.GET parameters (optional)
        return queryset


class WardViewSet(viewsets.ModelViewSet):
    queryset = Ward.objects.select_related('lga').all()  # Pre-fetch related LGA data
    serializer_class = WardSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Add custom filtering based on request.GET parameters (optional)
        return queryset