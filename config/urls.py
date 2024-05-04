# ruff: noqa
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include
from django.urls import path, re_path
# from django.views import defaults as default_views
# from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView
from drf_spectacular.views import SpectacularSwaggerView
from rest_framework_simplejwt import views as jwt_views
from rest_framework.routers import DefaultRouter
from taxapp2.users.views import CurrentUserViewSet, UserCreateView, UserViewSet, ChangePasswordView
from drf_spectacular.views import SpectacularAPIView

router = DefaultRouter()
router.register(r'user/me', CurrentUserViewSet)
# router.register(r'users', UserViewSet)
# router.register('user', UserCreateView, basename = 'new_user')

# router.register('send-email', SendEmailView,  basename='send_email')

urlpatterns = [
    
    path(settings.ADMIN_URL, admin.site.urls),
    # ...
    # Media files
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
]

# API URLS
urlpatterns += [
    #custom endpoints
    path('api/v1/', include(router.urls)),
    path('api/v1/new_user', UserCreateView.as_view(), name = 'new_user'),
    re_path(r'^api/v1/users/(?P<pk>[^/]+)?$', UserViewSet.as_view(), name='user-detail'),
    path('api/v1/change_password/', ChangePasswordView.as_view(), name = 'change_password'),
    
    #Token
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),  
    
    #Password Reset
    path(r'api/password_reset/', include('django_rest_passwordreset.urls', namespace = 'password_reset')),
    
    # Spectacular
    path("api/schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="api-schema"),
        name="api-docs",
    ),
]

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
