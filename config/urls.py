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
from taxapp2.users.views import (
    CurrentUserViewSet, 
    UserStaffCreateView,
    UserViewSet, 
    ChangePasswordView,
    GroupViewSet,
    CustomResetPasswordRequestToken,
    StateViewSet,
    LGASViewSet,
    WardViewSet,
    WardAndMonitorListView,
    TaxAreaViewSet,
    LGAsupervisorViewSet,
    StatesupervisorViewSet,
    StaffUserViewSet,
    CustomTokenObtainPairView,
    MyTokenRefreshView,
)
from taxpayer.views import (
    BusinessUserViewSet,
    BusinessStatusViewSet,
    WithholdingTaxRateViewSet,
    BusinessClassificationViewSet,
    AssessmentListView,
    UpdateAssessmentView_AssessmentOfficer,
    UpdateAssessmentView_AuditOfficer,
    ApproveAssessmentView,
    PaymentView,
    payment_webhook,
    PaymentListView,
    InvoiceListView,
    PaymentDetailView,
    InvoiceDetailView,
    ManualPaymentVerificationView,
)


router = DefaultRouter()
router.register(r'user/me', CurrentUserViewSet, basename='current-user')
router.register('groups', GroupViewSet)
router.register('policy_configuration/states', StateViewSet)
router.register('policy_configuration/lga', LGASViewSet)
router.register('policy_configuration/wards', WardViewSet)
# router.register('policy_configuration/wards_and_monitors', WardAndMonitorListView)
router.register('policy_configuration/tax-areas', TaxAreaViewSet)
router.register('user/tax-payer', BusinessUserViewSet)
router.register(r'policy_configuration/assigned/lga-supervisors', LGAsupervisorViewSet)
router.register(r'policy_configuration/assigned/state-supervisors', StatesupervisorViewSet)
router.register(r'policy_configuration/business-classifications', BusinessClassificationViewSet)
router.register(r'policy_configuration/withholding-tax-rates', WithholdingTaxRateViewSet)
router.register(r'policy_configuration/business-statuses', BusinessStatusViewSet)

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
    path('api/v1/user/staff', UserStaffCreateView.as_view(), name = 'new_staff'),
    path('api/v1/user/staff-list', StaffUserViewSet.as_view({'get': 'list'}), name = 'staff list'),
    re_path(r'^api/v1/all_users/$', UserViewSet.as_view({'get': 'list'}), name='user-list'),
    re_path(r'^api/v1/all_users/(?P<pk>[^/]+)/$', UserViewSet.as_view({'put': 'put', 'delete': 'destroy'}), name='user-detail'),
    path('api/v1/user/change_password/', ChangePasswordView.as_view(), name = 'change_password'),
    path('api/v1/wardandmonitors/', WardAndMonitorListView.as_view(), name='wardandmonitor-list'),
    path('api/v1/assessments/', AssessmentListView.as_view(), name='assessment-list'),
    path('api/v1/assessments/assessment_officer/update/<int:pk>/', UpdateAssessmentView_AssessmentOfficer.as_view(), name='assessment-officer'),
    path('api/v1/assessments/audit_officer/query_update/<int:pk>/', UpdateAssessmentView_AuditOfficer.as_view(), name='audit-officer'),
    path('api/v1/assessments/audit_officer/approve/<int:assessment_id>/', ApproveAssessmentView.as_view(), name='update-assessment'),
    #payment
    path("api/v1/user/taxpayer/invoice/initiate_payment/", PaymentView.as_view(), name='invoice_payment'),
    path('api/v1/user/taxpayer/payments/verify/', ManualPaymentVerificationView.as_view(), name='manual-payment-verification'),
    path('api/v1/user/taxpayer/invoice/payments/webhook/', payment_webhook, name='flutterwave-webhook'),
    path('api/v1/user/taxpayer/invoice/payments/', PaymentListView.as_view()),
    path('api/v1/user/taxpayer/invoice/payments/<int:pk>/', PaymentDetailView.as_view()),
    path('api/v1/user/taxpayer/invoices/', InvoiceListView.as_view()),
    path('api/v1/user/taxpayer/invoices/<int:pk>/', InvoiceDetailView.as_view()),
    #Token
    # path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/custom/refresh/', MyTokenRefreshView.as_view(), name='custom_token_refresh'),
    #Password Reset
    path(r'api/password_reset/', include('django_rest_passwordreset.urls', namespace = 'password_reset')),
    path('api/password_reset/custom/', CustomResetPasswordRequestToken.as_view(), name = 'custom_password_reset'),
    # Spectacular
    path("api/schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path(
        "",
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
