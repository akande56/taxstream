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
    TaxArea,
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
    TaxAreaSerializer,

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
    """
    Permissions: isAuthenticated
    """
    serializer_class = CreateUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=HTTP_201_CREATED)


class UserViewSet(GenericAPIView, ListModelMixin, UpdateModelMixin, DestroyModelMixin):
    """
    Permissions: isAuthenticated
    """
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request):
        """"
        the Get request does not require any ID. the endpoint returns all users
        
        """
        return self.list(request)

    def put(self, request, pk):
        instance = self.get_object() 
        serializer = self.get_serializer(instance, data=request.data, partial=True)  
        serializer.is_valid(raise_exception=True)  
        serializer.save()  
        return self.partial_update(request, pk)

    def delete(self, request, pk):
        return self.destroy(request, pk)


class ChangePasswordView(APIView):
    """
    body: old_password, new_password1, new_password2
    Permissions: isAuthenticated 
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
    Permissions: isAdminUser
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
    """
    Permissions: AllowAny
    """
    serializer_class = CustomEmailSerializer
    permission_classes = ()
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        

        email = serializer.validated_data['email']
        user_model = get_user_model()

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
    """
    "\n **Permissions:** IsAuthenticated, IsAdminUser "
    "\n **Allow filter by**: name(state object field; name), supervisor1(username) "
    "\n"
    "\n This API provides a comprehensive set of endpoints for managing State within the system. "
                "All endpoints require authentication with admin privileges. Here's a summary of the functionalities provided: "
                "\n  - **GET ;Listing States:** Retrieve a list of all states in the system. "
                "\n  - **POST ;Creating State:** Create a new state. "
                "\n  - **GET/ID ;Retrieving a State detail:** Get detailed information about a specific state by its ID. "
                "\n  - **PUT ;Updating State:** Modify the name or other relevant attributes of an existing state. "
                "\n  - **DEL ;Deleting State:** Permanently remove a state from the system. "
                "\nCommon response codes include: "
                "- 200: Successful operation."
                "- 400: Bad request (e.g., validation errors, invalid data format)."
                "- 401: Unauthorized access (missing authentication credentials or invalid credentials)."
                "- 403: Permission denied (user lacks necessary privileges)."
                "- 404: Not Found (resource with the provided ID does not exist)."
    """
    queryset = State.objects.all()
    serializer_class = StateSerializer
    filter_fields = ('name',)  
    permission_classes = [IsAdminUser, IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        return queryset


class LGASViewSet(viewsets.ModelViewSet):
    """
    "\nPermissions: IsAdminUser, IsAuthenticated"
    "\nAllow filter: name (LGA object field; name), code, state__name (ForeignKey to state object, field; name)"
    "\n"
    "\n This API provides a comprehensive set of endpoints for managing LGA within the system. "
                "All endpoints require authentication with admin privileges. Here's a summary of the functionalities provided: "
                "\n  - **GET ;Listing LGAs:** Retrieve a list of all LGA in the system. "
                "\n  - **POST ;Creating new LGA:** Create a new LGA. "
                "\n  - **GET/ID ;Retrieving a LGA detail:** Get detailed information about a specific LGA by its ID. "
                "\n  - **PUT ;Updating LGA:** Modify the name or other relevant attributes of an existing LGA. "
                "\n  - **DEL ;Deleting LGA:** Permanently remove a LGA from the system. "
                "\nCommon response codes include: "
                "- 200: Successful operation."
                "- 400: Bad request (e.g., validation errors, invalid data format)."
                "- 401: Unauthorized access (missing authentication credentials or invalid credentials)."
                "- 403: Permission denied (user lacks necessary privileges)."
                "- 404: Not Found (resource with the provided ID does not exist)."
    """
    queryset = LGA.objects.select_related('state').all() 
    serializer_class = LGASerializer
    filter_fields = ('name', 'code', 'state__name')  
    permission_classes = [IsAdminUser, IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        return queryset


class WardViewSet(viewsets.ModelViewSet):
    """
    Permissions: IsAdminUser, IsAuthenticated
    "\n"
    "\n This API provides a comprehensive set of endpoints for managing LGA within the system. "
                "All endpoints require authentication with admin privileges. Here's a summary of the functionalities provided: "
                "\n  - **GET ;Listing LGAs:** Retrieve a list of all LGA in the system. "
                "\n  - **POST ;Creating new LGA:** Create a new LGA. "
                "\n  - **GET/ID ;Retrieving a LGA detail:** Get detailed information about a specific LGA by its ID. "
                "\n  - **PUT ;Updating LGA:** Modify the name or other relevant attributes of an existing LGA. "
                "\n  - **DEL ;Deleting LGA:** Permanently remove a LGA from the system. "
                "\nCommon response codes include: "
                "- 200: Successful operation."
                "- 400: Bad request (e.g., validation errors, invalid data format)."
                "- 401: Unauthorized access (missing authentication credentials or invalid credentials)."
                "- 403: Permission denied (user lacks necessary privileges)."
                "- 404: Not Found (resource with the provided ID does not exist)."

    """

    queryset = Ward.objects.select_related('lga').all()
    serializer_class = WardSerializer
    permission_classes = [IsAdminUser, IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        return queryset



class TaxAreaViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing tax areas.
    """
    queryset = TaxArea.objects.all().select_related('ward')  # Prefetch ward data
    serializer_class = TaxAreaSerializer
    permission_classes = [IsAdminUser]  

    # def perform_create(self, serializer):
    #     # You can add custom logic here before saving the TaxArea object,
    #     # such as accessing data from the request or performing additional validations.
    #     serializer.save()