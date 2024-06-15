from django.contrib.auth import update_session_auth_hash, authenticate, get_user_model
from django.contrib.auth.models import Group
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse
from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
    OpenApiTypes,
    OpenApiExample,
)
from rest_framework.status import (
    HTTP_201_CREATED, 
    HTTP_200_OK, 
    HTTP_400_BAD_REQUEST,
    HTTP_204_NO_CONTENT,
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
    HTTP_USER_AGENT_HEADER,
    )
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import (
    User,
    State,
    LGA,
    Ward,
    TaxArea,
    LGAsupervisor,
    Statesupervisor,
)
from .permissions import (
    IsSupervisor1, 
    IsSupervisor2,
)
from .serializers import (
    UserSerializer, 
    UserListSerializer,
    CreateUserSerializer,
    ChangePasswordSerializer,
    GroupSerializer,
    CustomEmailSerializer,
    StateSerializer,
    LGASerializer,
    LGADetailSerializer,
    WardSerializer,
    WardDetailSerializer,
    TaxAreaSerializer,
    TaxAreaDetailSerializer,
    StatesupervisorSerializer,
    LGAsupervisorSerializer,
    CustomTokenObtainPairSerializer,
    
)

@extend_schema(
    summary="Get details of Sign-in User instance",
    description="Retrieve details of User instance of current user(i.e logged-in); needs acess token in header i.e Authorization Bearer <acess token>. Note: to get both User and business details try api/v1/user/tax-payer",

    
    responses={
        200: UserListSerializer,
        400: "Bad Request",
    }
)
class CurrentUserViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        serializer = UserListSerializer(request.user)
        return Response(serializer.data)




@extend_schema(
    summary="Create new staff with different roles",
    description="Add new staff, ensure strong password, and two more than one name for full name. \n Username is automatically email",
    request=CreateUserSerializer,

    examples=[
            OpenApiExample(
                'Example payload',
                value={
                    "email": "abdulsalamabubakar52@example.com",
                    "password": "pass123..",
                    "phone": "091",
                    "user_role": "supervisor1",
                    "full_name": "abdul abdul",
                    "location": 1
                }
            )
        ],

    )
class UserCreateView(APIView):
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=HTTP_201_CREATED)





@extend_schema(
    summary="Apply on all User instance (list/update/delete)",
    request=UserSerializer,
)
class UserViewSet(viewsets.ViewSet, generics.ListAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    """
    API endpoint for managing users.

    Permissions: By default, allows access to anyone (consider using IsAuthenticated).
    """

    permission_classes = [AllowAny] 

    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserListSerializer
        return UserSerializer

    def list(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        self.perform_destroy(self.get_object())
        return Response(status=HTTP_204_NO_CONTENT)




class StaffUserViewSet(viewsets.ViewSet):  
    permission_classes = [AllowAny]

    def list(self, request):
        users = User.objects.exclude(user_role = 'tax_payer')
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)




@extend_schema(
    summary="Change password for current logged in User",
    description="Accept current user password with new password, to change password",
    request=ChangePasswordSerializer,
    responses=ChangePasswordSerializer,
    )
class ChangePasswordView(APIView):
    """
    body: old_password, new_password1, new_password2
    Permissions: isAuthenticated 
    """
    permission_classes = [AllowAny]

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




@extend_schema_view(
    summary="Manage Group for diffent User roles",
    list=extend_schema(
        description="Retrieve a list Groups",
        summary="Users Groups",
    ),
    retrieve=extend_schema(
        description="Retrieve a single user Group by ID",
        summary="Retrieve a User Group",
        
    ),
    create=extend_schema(
        description="Create a new user Group",
        summary="Create User Group",
        request= GroupSerializer,
        responses={200: GroupSerializer},
    ),
    update=extend_schema(
        description="Update an existing Group",
        summary="Update Group",
        request=GroupSerializer,
        responses={200: GroupSerializer}
    ),
    partial_update=extend_schema(
        description="Partially update an existing Group",
        summary="Partial Update Group",
        request=GroupSerializer,
        responses={200: GroupSerializer}
    ),
    destroy=extend_schema(
        description="Delete a Group",
        summary="Delete Group",
        
    ),
    )
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
    permission_classes = [AllowAny]
    





@extend_schema(
    summary="Reset password for user (Temporary in-use)",
    description="Handle case for forget password",
    request=CustomEmailSerializer,
    )
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








@extend_schema_view(
    summary="State vieset",
    list=extend_schema(
        description="Retrieve list State",
        summary="expect a single state to exist; future implementation will ensure this",
    ),
    retrieve=extend_schema(
        description="Retrieve a single user State by ID",
        summary="Retrieve a State",
        
    ),
    create=extend_schema(
        description="Create a new user State",
        summary="Create User State",
        request= StateSerializer,
        responses={200: StateSerializer},
    ),
    update=extend_schema(
        description="Update an existing State",
        summary="Update State",
        request=StateSerializer,
        responses={200: StateSerializer}
    ),
    partial_update=extend_schema(
        description="Partially update an existing State",
        summary="Partial Update State",
        request=StateSerializer,
        responses={200: StateSerializer}
    ),
    destroy=extend_schema(
        description="Delete a State",
        summary="Delete State",
        
    ),
    )
class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer
    filter_fields = ('name',)  
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        return queryset





@extend_schema_view(
    summary="LGA viewset",
    list=extend_schema(
        description="Retrieve list LGA's",
        summary="List of LGA's",
        request=LGADetailSerializer,
    ),
    retrieve=extend_schema(
        description="Retrieve a single user LGA by ID",
        summary="Retrieve a LGA",
        request= LGADetailSerializer,
    ),
    create=extend_schema(
        description="Create a new user LGA",
        summary="Create User LGA",
        request= LGASerializer,
        responses={200: LGASerializer},
    ),
    update=extend_schema(
        description="Update an existing LGA",
        summary="Update LGA",
        request=LGASerializer,
        responses={200: LGASerializer}
    ),
    partial_update=extend_schema(
        description="Partially update an existing LGA",
        summary="Partial Update LGA",
        request=LGASerializer,
        responses={200: LGASerializer}
    ),
    destroy=extend_schema(
        description="Delete a LGA",
        summary="Delete LGA",
    ),
    )
class LGASViewSet(viewsets.ModelViewSet):
    queryset = LGA.objects.select_related('state').all() 
    filter_fields = ('name', 'code', 'state__name')  
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return LGADetailSerializer
        else:
            return LGASerializer






@extend_schema_view(
    list=extend_schema(
        description="Retrieve a list of LGA supervisors",
        summary="List LGA Supervisors",
    ),
    retrieve=extend_schema(
        description="Retrieve a single LGA supervisor by ID",
        summary="Retrieve LGA Supervisor",
    ),
    create=extend_schema(
        description="Create a new LGA supervisor",
        summary="Create LGA Supervisor",
        request=LGAsupervisorSerializer
    ),
    update=extend_schema(
        description="Update an existing LGA supervisor",
        summary="Update LGA Supervisor",
        request=LGAsupervisorSerializer
    ),
    partial_update=extend_schema(
        description="Partially update an existing LGA supervisor",
        summary="Partial Update LGA Supervisor",
        request=LGAsupervisorSerializer
    ),
    destroy=extend_schema(
        description="Delete an LGA supervisor",
        summary="Delete LGA Supervisor",
    ),
)
class LGAsupervisorViewSet(viewsets.ModelViewSet):
    queryset = LGAsupervisor.objects.all()
    serializer_class = LGAsupervisorSerializer
    permission_classes = [AllowAny]







@extend_schema_view(
    list=extend_schema(
        description="Retrieve a list of State supervisors",
        summary="List State Supervisors",
        
    ),
    retrieve=extend_schema(
        description="Retrieve a single State supervisor by ID",
        summary="Retrieve State Supervisor",
    ),
    create=extend_schema(
        description="Create a new State supervisor",
        summary="Create State Supervisor",
        request=StatesupervisorSerializer
    ),
    update=extend_schema(
        description="Update an existing State supervisor",
        summary="Update State Supervisor",
        request=StatesupervisorSerializer
    ),
    partial_update=extend_schema(
        description="Partially update an existing State supervisor",
        summary="Partial Update State Supervisor",
        request=StatesupervisorSerializer
    ),
    destroy=extend_schema(
        description="Delete a State supervisor",
        summary="Delete State Supervisor",
    ),
)
class StatesupervisorViewSet(viewsets.ModelViewSet):
    queryset = Statesupervisor.objects.all()
    serializer_class = StatesupervisorSerializer
    permission_classes = [AllowAny]






@extend_schema_view(
    summary="WARD vieset",
    list=extend_schema(
        description="Retrieve list WARD's",
        summary="List of WARD's",
        request=WardDetailSerializer
    ),
    retrieve=extend_schema(
        description="Retrieve a single user WARD by ID",
        summary="Retrieve a WARD",
        request=WardDetailSerializer
    ),
    create=extend_schema(
        description="Create a new user WARD",
        summary="Create User WARD",
        request= WardSerializer,
        responses={200: WardSerializer},
    ),
    update=extend_schema(
        description="Update an existing WARD",
        summary="Update WARD",
        request=WardSerializer,
        responses={200: WardSerializer}
    ),
    partial_update=extend_schema(
        description="Partially update an existing WARD",
        summary="Partial Update WARD",
        request=WardSerializer,
        responses={200: WardSerializer}
    ),
    destroy=extend_schema(
        description="Delete a WARD",
        summary="Delete WARD",
    ),
    )
class WardViewSet(viewsets.ModelViewSet):
    queryset = Ward.objects.select_related('lga').all()
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return WardDetailSerializer 
        else:
            return WardSerializer







@extend_schema_view(
    summary="TaxArea vieset",
    list=extend_schema(
        description="Retrieve list TaxArea's",
        summary="List of TaxArea's",
        request=TaxAreaDetailSerializer
    ),
    retrieve=extend_schema(
        description="Retrieve a single user TaxArea by ID",
        summary="Retrieve a TaxArea",
        request=TaxAreaDetailSerializer
    ),
    create=extend_schema(
        description="Create a new user TaxArea",
        summary="Create User TaxArea",
        request= TaxAreaSerializer,
        responses={200: TaxAreaSerializer},
    ),
    update=extend_schema(
        description="Update an existing TaxArea",
        summary="Update TaxArea",
        request=TaxAreaSerializer,
        responses={200: TaxAreaSerializer}
    ),
    partial_update=extend_schema(
        description="Partially update an existing TaxArea",
        summary="Partial Update TaxArea",
        request=TaxAreaSerializer,
        responses={200: TaxAreaSerializer}
    ),
    destroy=extend_schema(
        description="Delete a TaxArea",
        summary="Delete TaxArea",
    ),
    )
class TaxAreaViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing tax areas.
    """
    queryset = TaxArea.objects.all().select_related('ward')  # Prefetch ward data
    permission_classes = [AllowAny]  
    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return TaxAreaDetailSerializer 
        else:
            return TaxAreaSerializer



#........ custom token...

class CustomTokenObtainPairView(APIView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)