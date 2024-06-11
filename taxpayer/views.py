import uuid
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiTypes, OpenApiExample
from .models import (
    BusinessUser,
    BusinessClassification,
    BusinessStatus,
    WithholdingTaxRate,
    Assessment,
)
from .serializers import (
    BusinessUserSerializer,
    # BusinessUserListSerializer,
    BusinessUserRetrieveListSerializer,
    BusinessUserUpdateSerializer,
    BusinessClassificationSerializer,
    WithholdingTaxRateSerializer,
    BusinessStatusSerializer,
    NewCreateUserSerializer,
    AssessmentSerializer,
    UpdateAssessment_AssessmentOfficerSerializer,
    UpdateAssessment_AuditOfficerSerializer,

)
from taxapp2.users.models import LGA



@extend_schema_view(
    list=extend_schema(
        description="Retrieve a list of business users",
        summary="List Business Users",
        responses={201: BusinessUserRetrieveListSerializer},
    ),
    retrieve=extend_schema(
        description="Retrieve a single business user by ID",
        summary="Retrieve Business User",
        responses={201: BusinessUserRetrieveListSerializer},
        
    ),
    create=extend_schema(
        description="Create a new business user",
        summary="Create Business User",
        request=BusinessUserSerializer,
        responses={201: BusinessUserSerializer},
        examples=[
            OpenApiExample(
                'Example payload',
                value={
                    "user": {
                        "password": "password123",
                        "email": "abdulsalamabubakar52@gmail.com",
                        "first_name" : "first_name",
                        "last_name" : "last_name",
                        "user_role": "tax_payer",
                        "phone": "1234567890",
                        "location": 1
                    },
                    "business_name": "Tech Innovations Ltd.",
                    "classification": 1,
                    "withholding_tax_rate": 1,
                    "business_status": 1,
                    "tax_area": 1,
                    "anual_income" : 1,
                    "type": "individual"
                    
                }
            )
        ]
    ),
    update=extend_schema(
        description="Update an existing business user",
        summary="Update Business User",
        request=BusinessUserSerializer,
        responses={200: BusinessUserSerializer}
    ),
    partial_update=extend_schema(
        description="Partially update an existing business user",
        summary="Partial Update Business User",
        request=BusinessUserSerializer,
        responses={200: BusinessUserSerializer}
    ),
    destroy=extend_schema(
        description="Delete a business user",
        summary="Delete Business User",
        
    ),
)
class BusinessUserViewSet(viewsets.ModelViewSet):
    queryset = BusinessUser.objects.all()
    permission_classes = [AllowAny]  

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return BusinessUserRetrieveListSerializer
        return BusinessUserUpdateSerializer

    def create(self, request):
        serializer = BusinessUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        business_user = serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)



#-----------------------


@extend_schema(
    summary="Configure policy; business classifications",
    description="",
    request= BusinessClassificationSerializer,
    responses= BusinessClassificationSerializer
    )
class BusinessClassificationViewSet(viewsets.ModelViewSet):
    queryset = BusinessClassification.objects.all()
    serializer_class = BusinessClassificationSerializer
    permission_classes = [AllowAny]

    @extend_schema(
        description="Create a new business classification",
        summary="Create Business Classification",
        request=BusinessClassificationSerializer,
        responses={201: BusinessClassificationSerializer},
        examples=[
            OpenApiExample(
                'Example payload',
                value={
                    "name": "Technology",
                    "description": "Tech companies"
                }
            )
        ]
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)




@extend_schema(
    summary="Configure policy; withoholding tax",
    description="",
    request= WithholdingTaxRateSerializer,
    responses= WithholdingTaxRateSerializer
    )
class WithholdingTaxRateViewSet(viewsets.ModelViewSet):
    queryset = WithholdingTaxRate.objects.all()
    serializer_class = WithholdingTaxRateSerializer
    permission_classes = [AllowAny]

    @extend_schema(
        description="Create a new withholding tax rate",
        summary="Create Withholding Tax Rate",
        request=WithholdingTaxRateSerializer,
        responses={201: WithholdingTaxRateSerializer},
        examples=[
            OpenApiExample(
                'Example payload',
                value={
                    "payment": "Service Tax",
                    "rate": "5.00"
                }
            )
        ]
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)




@extend_schema(
    summary="Configure policy; tax-payer business status",
    description="",
    request= BusinessStatusSerializer,
    responses= BusinessStatusSerializer
    )
class BusinessStatusViewSet(viewsets.ModelViewSet):
    queryset = BusinessStatus.objects.all()
    serializer_class = BusinessStatusSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Create a new business status",
        summary="Create Business Status",
        request=BusinessStatusSerializer,
        responses={201: BusinessStatusSerializer},
        examples=[
            OpenApiExample(
                'Example payload',
                value={
                    "status": "Active"
                }
            )
        ]
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)



# assesment and audit


@extend_schema(
    summary="Assessment, list of tax payer assessment form",
    description="",
    request= AssessmentSerializer,
    responses= AssessmentSerializer
    )
class AssessmentListView(ListAPIView):
    
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Assessment.objects.all()
        # user_area = self.request.user.location
        # queryset = queryset.(user__location=user_area)
        return queryset



@extend_schema(
    request={
        'assessment_officer': {
            'type': 'object',
            'properties': {
                'to_be_paid': {'type': 'number'},
                'tax_due_time': {'type': 'string', 'format': 'date'},
            },
            'required': ['to_be_paid', 'tax_due_time']
        },
        'audit_officer': {
            'type': 'object',
            'properties': {
                'query': {'type': 'string'},
            },
            'required': ['query']
        }
    },
    responses={
        200: UpdateAssessment_AssessmentOfficerSerializer,
        403: '{"error": "Unauthorized to update this assessment"}'
    }
)
class UpdateAssessmentView(UpdateAPIView):
    
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateAssessment_AssessmentOfficerSerializer
    def get_serializer_class(self):

        if (self.request.user.user_role == 'assessment_officer'):  # Assessment officer permission
            return UpdateAssessment_AssessmentOfficerSerializer
        elif (self.request.user.user_role == 'audit_officer'):  # Audit officer permission
            return UpdateAssessment_AuditOfficerSerializer
        else:
            return Response({'error': 'Unauthorized to update this assessment'}, status=403)

    def get_queryset(self):
        return Assessment.objects.all()
    