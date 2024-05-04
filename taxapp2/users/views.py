from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_201_CREATED
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

# class SendEmailView(APIView):
#     def post(self, request):
#         serializer = EmailSerializer(data=request.data)
#         if serializer.is_valid():
#             subject = serializer.validated_data['subject']
#             message = serializer.validated_data['message']
#             recipient_email = serializer.validated_data['recipient_email']
#             from_email = serializer.validated_data['from_email']

#             try:
#                 send_mail(subject, message, from_email, [recipient_email])
#                 return Response({'message': 'Email sent successfully.'})
#             except Exception as e:
#                 logger.error("Error sending email: %s", str(e))
#                 return Response({'error': str(e)}, status=500)
#         else:
#             return Response(serializer.errors, status=400)

# class UserViewSet(mixins.RetrieveModelMixin,
#                   mixins.UpdateModelMixin,
#                   viewsets.GenericViewSet):
#     """
#     Updates and retrieves user accounts
#     """
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = (IsUserOrReadOnly,)

#     def get_object(self, request: Request, pk = None) -> User:
#         if request.user.is_authenticated:
#             return request.user
#         else:
#             raise PermissionDenied("You are not authenticated.")
    
# class UserCreateViewSet(mixins.CreateModelMixin,
#                         viewsets.GenericViewSet):
#     """
#     Creates user accounts...
#     """
#     queryset = User.objects.all()
#     serializer_class = CreateUserSerializer
#     permission_classes = (AllowAny,)
