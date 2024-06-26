
import os
# import uuid
import requests
import hmac
import hashlib
import json
# from django.contrib.auth import get_user_model
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiTypes, OpenApiExample
from .models import (
    BusinessUser,
    BusinessClassification,
    BusinessStatus,
    WithholdingTaxRate,
    Assessment,
    Invoice,
    Payment,
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
    PaymentSerializer,
    InvoiceSerializer,
)
from taxapp2.users.models import LGA
from taxapp2.users.permissions import IsAuditor_or_IsAssessor, IsAuditOfficer


@extend_schema_view(
    list=extend_schema(
        description="Retrieve a list of business users",
        # summary="List Business Users",
        responses={201: BusinessUserRetrieveListSerializer},
    ),
    retrieve=extend_schema(
        description="Retrieve a single business user by ID",
        # summary="Retrieve Business User",
        responses={201: BusinessUserRetrieveListSerializer},
        
    ),
    create=extend_schema(
        description="Create a new business user",
        # summary="Create Business User",
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
                    "type": "individual",
                    "ward": 1,
                    
                }
            )
        ]
    ),
    update=extend_schema(
        description="Update an existing business user",
        # summary="Update Business User",
        request=BusinessUserSerializer,
        responses={200: BusinessUserSerializer}
    ),
    partial_update=extend_schema(
        description="Partially update an existing business user",
        # summary="Partial Update Business User",
        request=BusinessUserSerializer,
        responses={200: BusinessUserSerializer}
    ),
    destroy=extend_schema(
        description="Delete a business user",
        # summary="Delete Business User",
        
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
        Assessment.objects.create(user=business_user)
        return Response(serializer.data, status=HTTP_201_CREATED)



#-----------------------


@extend_schema(
    description="Configure policy; business classifications",
    # description="",
    request= BusinessClassificationSerializer,
    responses= BusinessClassificationSerializer
    )
class BusinessClassificationViewSet(viewsets.ModelViewSet):
    queryset = BusinessClassification.objects.all()
    serializer_class = BusinessClassificationSerializer
    permission_classes = [AllowAny]

    @extend_schema(
        description="Create a new business classification",
        # summary="Create Business Classification",
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
    description="Configure policy; withoholding tax",
    # description="",
    request= WithholdingTaxRateSerializer,
    responses= WithholdingTaxRateSerializer
    )
class WithholdingTaxRateViewSet(viewsets.ModelViewSet):
    queryset = WithholdingTaxRate.objects.all()
    serializer_class = WithholdingTaxRateSerializer
    permission_classes = [AllowAny]

    @extend_schema(
        description="Create a new withholding tax rate",
        # summary="Create Withholding Tax Rate",
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
    description="Configure policy; tax-payer business status",
    # description="",
    request= BusinessStatusSerializer,
    responses= BusinessStatusSerializer
    )
class BusinessStatusViewSet(viewsets.ModelViewSet):
    queryset = BusinessStatus.objects.all()
    serializer_class = BusinessStatusSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Create a new business status",
        # summary="Create Business Status",
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
    description="Assessment form: list of tax payer assessment form",
    # description="",
    request= AssessmentSerializer,
    responses= AssessmentSerializer
    )
class AssessmentListView(ListAPIView):
    
    serializer_class = AssessmentSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = Assessment.objects.all()
        # user_area = self.request.user.location
        # queryset = queryset.(user__location=user_area)
        return queryset



@extend_schema(
    description="update tax payer assessment detail: assessment officer endpoint",
    # description=
    # " Use Postman to Test: May not run directly due to options for assessment and audit officer; note the different post request change option(assessment\audit officer). Upon adding assessment submission; assessment_status for taxpayer will be update to <reviewed>, while upon audit submission will be <query>",
    request= UpdateAssessment_AssessmentOfficerSerializer
    # {
    #     'assessment_officer': {
    #         'type': 'object',
    #         'properties': {
    #             'to_be_paid': {
    #                 'type': 'number',
    #                 'description': 'Amount of tax to be paid by the business user (assessment)',
    #             },
    #             'tax_due_time': {
    #                 'type': 'string',
    #                 'enum': ['annually', 'monthly', 'daily'],  # Using enum for predefined choices
    #                 'format': 'date',
    #                 'description': 'Frequency of tax payment (assessment)',
    #             },
    #         },
    #         'required': ['to_be_paid', 'tax_due_time']
    #     },
    #     'audit_officer': {
    #         'type': 'object',
    #         'properties': {
    #             'query': {
    #                 'type': 'string',
    #                 'description': 'Audit officer query regarding the assessment',
    #             },
    #         },
    #         'required': ['query']
    #     }
    # }
    ,
    responses={
        200: UpdateAssessment_AssessmentOfficerSerializer,
        # 403: '{"error": "Unauthorized to update this assessment(needs Assessment or Audit officer user role"}'
    }
)
class UpdateAssessmentView_AssessmentOfficer(UpdateAPIView):
    queryset = Assessment.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = UpdateAssessment_AssessmentOfficerSerializer



@extend_schema(
    description="update tax payer assessment detail: Audit officer endpoint",
    request= UpdateAssessment_AuditOfficerSerializer,
    responses={
        200: UpdateAssessment_AuditOfficerSerializer,
    }
)
class UpdateAssessmentView_AuditOfficer(UpdateAPIView):
    queryset = Assessment.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = UpdateAssessment_AuditOfficerSerializer

  # def get_serializer_class(self):
        
    #     if (self.request.user.user_role == 'assessment_officer'):
            
    #         return UpdateAssessment_AssessmentOfficerSerializer
    #     elif (self.request.user.user_role == 'audit_officer'):
    #         return UpdateAssessment_AuditOfficerSerializer
    #     else:
    #         return Response({'error': 'Unauthorized to update this assessment'}, status=403)

    # def get_queryset(self):
    #     return Assessment.objects.all()
    
    
    


@extend_schema(
    description= "Approve tax payer assessment form"
)
class ApproveAssessmentView(APIView):
  permission_classes = [IsAdminUser]
  
  def put(self, request, assessment_id):
    try:
      assessment = Assessment.objects.get(pk=assessment_id)
      
      # Manual validation (optional)
    #   if not all_required_fields_filled(assessment):  # Check for required fields
    #       return Response({'error': 'Missing required fields'}, status=400)

      assessment.approve_assessment()  
      assessment.save()
      return Response({'message': 'Assessment updated successfully'})
    except Assessment.DoesNotExist:
      return Response({'error': 'Assessment not found'}, status=404)
    except Exception as e:  
      return Response({'error': str(e)}, status=500)



# ****************** PAYMent ***************************** #

class PaymentView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        # Get invoice ID from request
        invoice_id = request.data.get('invoice_id')

        
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
        except Invoice.DoesNotExist:
            return Response({"message": "Invalid invoice ID"}, status=HTTP_400_BAD_REQUEST)

        
        customer_email = invoice.taxpayer.user.email
        amount = invoice.amount
        # currency = invoice.currency

        
        customer_name = f"{invoice.taxpayer.user.first_name}{invoice.taxpayer.user.last_name}"
        customer_phone = invoice.taxpayer.user.phone

    
        data = {
            "tx_ref": f"JG-tax-{invoice.id}-{invoice.taxpayer.tax_id}", 
            "amount": str(amount),
            "currency": "NGN",
            "customer": {
                "email": customer_email,
                "name": customer_name,  
                "phone_number": customer_phone, 
            },
            "redirect_url": 'https://taxstream-3r2y.onrender.com/payment',  # Capture response URL from client
            
            "meta": {  # Optional metadata to associate with the payment
                "invoice_id": invoice.id
            }
        }
        print(data)
        # Make the request to Flutterwave's payment initiation endpoint
        url = "https://api.flutterwave.com/v3/payments"
        headers = {"Authorization": f"Bearer {os.environ.get('FLUTTERWAVE_SECRET_KEY')}"}
        response = requests.post(url, json=data, headers=headers)

        # Check for successful response
        if response.status_code == 200:
            # Payment initiated successfully
            payment_data = response.json()
            redirect_url = payment_data.get('data', {}).get('link')  # Extract redirect URL
            return Response({"message": "Payment initiated successfully", "redirect_url": redirect_url})
        else:
            # Handle error (log the error and return a user-friendly message)
            return Response(response.json(), status=HTTP_400_BAD_REQUEST)




@csrf_exempt
def payment_webhook(request):
    if request.method == 'POST':
    
        if settings.DEBUG:  # For development, temporarily disable verification
            is_valid = True
        else:            
            data = request.body
            hash_algorithm = hashlib.sha256
            secret = settings.FLUTTERWAVE_SECRET_KEY.encode('utf-8')
            signature = hmac.new(secret, data, hash_algorithm).hexdigest()
            is_valid = request.META.get('HTTP_X_FLUTTERWAVE_HASH') == signature

        if is_valid:
            # Process the payment data (example using JSON)
            data = json.loads(request.body.decode())
            transaction_id = data.get('data', {}).get('transaction_id')
            payment_status = data.get('data', {}).get('status')
            invoice_id = data.get('meta', {}).get('invoice_id')
            invoice = Invoice.objects.get(pk=invoice_id)

            # Update your Payment model based on transaction ID and status
            try:
                payment = Payment.objects.get_or_create(transaction_id=transaction_id, invoice= invoice)
                payment.status = payment_status
                payment.amount_paid = invoice.amount
                payment.currency = invoice.currency

                # Populate other Payment fields based on invoice or request data
                payment.charged_amount = data.get('data', {}).get('charged_amount', None)
                payment.app_fee = data.get('data', {}).get('app_fee', None)
                payment.merchant_fee = data.get('data', {}).get('merchant_fee', None)
                payment.processor_response = data.get('data', {}).get('processor_response')
                payment.auth_model = data.get('data', {}).get('auth_model')
                payment.ip_address = data.get('data', {}).get('ip')
                payment.customer_name = data.get('data', {}).get('customer', {}).get('name')
                payment.customer_email = data.get('data', {}).get('customer', {}).get('email')
                payment.card_first_six_digits = data.get('data', {}).get('card', {}).get('first_6digits')
                payment.card_last_four_digits = data.get('data', {}).get('card', {}).get('last_4digits')
                payment.card_issuer = data.get('data', {}).get('card', {}).get('issuer')
                payment.card_country = data.get('data', {}).get('card', {}).get('country')
                payment.card_type = data.get('data', {}).get('card', {}).get('type')
                payment.card_expiry = data.get('data', {}).get('card', {}).get('expiry')
                payment.status = payment_status   
                payment.save()
            except Payment.DoesNotExist:
                # Handle potential errors (e.g., transaction not found)
                pass

            return Response({'message' : 'Webhook received and processed successfully'})
        else:
            return Response({'message' : 'Invalid webhook signature'}, status=400)
    else:
        return HttpResponse({'message': 'Method not allowed'}, status=405)



class PaymentListView(ListAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class InvoiceListView(ListAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer


class PaymentDetailView(RetrieveAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    lookup_field = 'pk' 


class InvoiceDetailView(RetrieveAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    lookup_field = 'pk'