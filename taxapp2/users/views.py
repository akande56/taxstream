from rest_framework import viewsets, mixins
# from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .permissions import IsUserOrReadOnly
from .serializers import CreateUserSerializer, UserSerializer


class CurrentUserViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            serializeData = UserSerializer(request.user)
            return Response(serializeData.data)
        else:
            return Response({'error': 'You are not authenticated.'}, status=401)

    queryset = User.objects.none()
    serializer_class = UserSerializer

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
