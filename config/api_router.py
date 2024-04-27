from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from taxapp2.users.views import CurrentUserViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

router.register("users", CurrentUserViewSet)


app_name = "api"
urlpatterns = router.urls
