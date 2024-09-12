import os
# import uuid
import requests
import hmac
import hashlib
import json
import logging
# from datetime import date, timedelta
from datetime import datetime
from dateutil.relativedelta import relativedelta
# from django.contrib.auth import get_user_model
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_200_OK
)
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from drf_spectacular.utils import (
    extend_schema, 
    extend_schema_view, 
    # OpenApiParameter, 
    # OpenApiTypes, 
    OpenApiExample,
)
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
    InitPaymentInvoiceSerializer,
    PaymentResponseSerializer,
    ManualPaymentVerificationSerializer,
)
from taxapp2.users.models import LGA
from taxapp2.users.permissions import IsAuditor_or_IsAssessor, IsAuditOfficer

logger = logging.getLogger(__name__)

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
    filter_fields = ('assessment_status')
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
  InvoiceSerializer = []
  def put(self, request, assessment_id):
    try:
      assessment = Assessment.objects.get(pk=assessment_id)
      
      if assessment.assessment_status == 'reviewed':
        assessment.assessment_status = 'approved'
        
        today = datetime.now().date()
        # Calculate due date based on tax_due_time
        if assessment.tax_due_time == 'annually':
            assessment.next_due_date =  today + relativedelta(years=1)
        elif assessment.tax_due_time == 'monthly':
            assessment.next_due_date = today + relativedelta(months=1)
        else:
            assessment.next_due_date = today + relativedelta(days=1)
    
        if Invoice.objects.filter(taxpayer = assessment.user):
            pass
        else:
            invoice, created = Invoice.objects.get_or_create(
            taxpayer=assessment.user,
            amount=assessment.to_be_paid,  # Replace with your calculation function
            due_date=assessment.next_due_date
            )
            invoice.save()

        assessment.save()
        return Response({'message': 'Assessment approved successfully'}, status=HTTP_200_OK)
      
      else:
        # Handle other assessment statuses with appropriate messages
        if assessment.assessment_status == 'pending review':
          return Response({'message': 'Assessment form yet to be reviewed, contact assessment_office to review.'})
        elif assessment.assessment_status == 'approved':
          return Response({'message': 'Assessment is already approved.'})
        elif assessment.assessment_status == 'query':
          return Response({'message': 'Assessment is currently under query, and cannot be approved. contact assessment_office to review'})
        else:
          return Response({'message': f'Invalid assessment status: {assessment.assessment_status}'})
    except Assessment.DoesNotExist:
      return Response({'error': 'Assessment not found'}, status=HTTP_404_NOT_FOUND)
    except Exception as e:  
      return Response({'error': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)




# ****************** PAYMent ***************************** #
@extend_schema_view(
    description="Initiate Flutterwave payment, returns payment link; to be sent to frontend so taxpayer can be redirected to flutterwave app to complete payment.",
    requests=InitPaymentInvoiceSerializer,
    responses={
        200: PaymentResponseSerializer, 
    }
)
class PaymentView(APIView):
    serializer_class = InitPaymentInvoiceSerializer
    permission_classes = [AllowAny]  # Consider security implications in production

    def post(self, request):
        # Get invoice ID from request
        invoice_id = request.data.get('invoice_id')

        try:
            invoice = Invoice.objects.get(pk=invoice_id)
        except Invoice.DoesNotExist:
            return Response({"message": "Invalid invoice ID"}, status=HTTP_400_BAD_REQUEST) 

        customer_email = invoice.taxpayer.user.email
        amount = invoice.amount
        customer_name = f"{invoice.taxpayer.user.first_name} {invoice.taxpayer.user.last_name}"
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
            "redirect_url": 'https://jirs.com.ng/payment',  # Capture response URL from client
            "meta": {  
                "invoice_id": invoice.id
            }
        }

        try:
            url = "https://api.flutterwave.com/v3/payments"
            headers = {"Authorization": f"Bearer {os.environ.get('FLUTTERWAVE_SECRET_KEY')}"}
            response = requests.post(url, json=data, headers=headers)
            response.raise_for_status()  # Raise an exception for non-200 status codes

        except requests.exceptions.RequestException as e:
            # Handle any general request errors (network issues, timeouts)
            return Response({"message": f"Error initiating payment: {str(e)}"}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        except Invoice.DoesNotExist:
            # Handle the case where the invoice is no longer available after initial retrieval (unlikely but possible)
            return Response({"message": "Invoice not found"}, status=HTTP_404_NOT_FOUND)
        except Exception as e:
            # Catch any other unexpected errors
            logger.error(f"Unexpected error during payment initiation: {str(e)}")
            return Response({"message": "Internal server error"}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        
        else:
            # Successful response
            payment_data = response.json()
            redirect_url = payment_data.get('data', {}).get('link')
            # serializer = PaymentResponseSerializer(
            #     data={"message": "Payment initiated successfully", "redirect_url": redirect_url}
            # )
            # serializer.message = "Payment initiated successfully"
            # serializer.redirect_url = redirect_url
            # serializer.is_valid(raise_exception=True)
            # print(serializer.message)
            return Response({"message": "Payment initiated successfully", "redirect_url": redirect_url})



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



@extend_schema(
    description="This endpoint allows manual verification of a payment by providing the transaction ID and tx_ref received from Flutterwave. The invoice ID is extracted from the tx_ref and checked against the provided invoice_id. Upon successful verification, the payment and invoice statuses are updated.",
    request=ManualPaymentVerificationSerializer,
    responses={
        200: 'Payment verified and updated successfully.',
        400: 'Bad request (invalid data, invoice not found, etc.)',
    }
)
class ManualPaymentVerificationView(APIView):
    def post(self, request):
        serializer = ManualPaymentVerificationSerializer(data=request.data)
        if serializer.is_valid():
            transaction_id = serializer.validated_data['transaction_id']
            invoice_id = serializer.validated_data.get('invoice_id')
            tx_ref = serializer.validated_data['tx_ref']
            provided_invoice_id = serializer.validated_data.get('invoice_id')
            
            try:
                # Assuming tx_ref format is "JG-tax-{invoice_id}-{taxpayer_tax_id}"
                extracted_invoice_id = int(tx_ref.split('-')[2])
        
            except (IndexError, ValueError):
                return Response({"message": "Invalid tx_ref format"}, status=HTTP_400_BAD_REQUEST)

            # Check if provided invoice_id matches extracted invoice_id
            if provided_invoice_id != extracted_invoice_id:
                
                return Response({"message": "Invoice ID mismatch"}, status=HTTP_400_BAD_REQUEST)

            try:
                invoice = Invoice.objects.get(pk=extracted_invoice_id)
            except Invoice.DoesNotExist:
                return Response({"message": "Invalid invoice ID"}, status=HTTP_400_BAD_REQUEST)

            try:
                payment = Payment.objects.get(transaction_id=transaction_id)
            except Payment.DoesNotExist:
                if invoice_id:
                    try:
                        invoice = Invoice.objects.get(pk=invoice_id)
                        payment = Payment.objects.create(transaction_id=transaction_id, invoice=invoice)
                    except Invoice.DoesNotExist:
                        return Response({"message": "Invalid invoice ID"}, status=HTTP_400_BAD_REQUEST)
                

            # Implement logic to verify payment with Flutterwave API (pseudocode)
            data = self.verify_payment(transaction_id)

            if data:
                print("data: ",data)
                verification_status = data.get('status', '').lower()
                if verification_status == 'successful':
                    payment.status = 'completed'
                    payment.amount_paid = invoice.amount
                    payment.currency ="NGN"

                    # Populate other Payment fields based on invoice or request data
                    payment.charged_amount = data['charged_amount']
                    payment.app_fee = data['app_fee']
                    payment.merchant_fee = data['merchant_fee']
                    payment.processor_response = data['processor_response']
                    payment.auth_model = data['auth_model']
                    payment.ip_address = data['ip']
                    payment.customer_name = data['customer']['name']
                    payment.customer_email = data['email']['email']
                    payment.payment_date = data['payment_type']
                    payment.created_date = data['created_at']
                    payment.card_first_six_digits = data.get('data', {}).get('card', {}).get('first_6digits')
                    payment.card_last_four_digits = data.get('data', {}).get('card', {}).get('last_4digits')
                    payment.card_issuer = data.get('data', {}).get('card', {}).get('issuer')
                    payment.card_country = data.get('data', {}).get('card', {}).get('country')
                    payment.card_type = data.get('data', {}).get('card', {}).get('type')
                    payment.card_expiry = data.get('data', {}).get('card', {}).get('expiry')
                    payment.save()
                    if invoice:
                        invoice.status = 'paid'
                        invoice.save()
                serializer = PaymentSerializer(payment)
                return Response(serializer.data, status=HTTP_200_OK)
            else:
                return Response({"message": "Payment verification failed"}, status=HTTP_400_BAD_REQUEST)

        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)



    def verify_payment(self, transaction_id):
        url = f"https://api.flutterwave.com/v3/transactions/{transaction_id}/verify"
        headers = {
            "Authorization": f"Bearer {os.environ.get('FLUTTERWAVE_SECRET_KEY')}",
            "Content-Type": "application/json",
        }

        try:
            response = requests.get(url, headers=headers)
            print('response: ', response.content)
            response.raise_for_status()
            verification_data = response.json()
            
            if verification_data.get('status') == 'success':
                return verification_data.get('data')
            else:
                return None
        except requests.exceptions.RequestException as e:
            print(f"Error verifying payment: {str(e)}")
            return None


@extend_schema(
    description="Get a list of all payments.",
    responses={200: PaymentSerializer(many=True)},  
)
class PaymentListView(ListAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer



@extend_schema(
    description="Get a list of all invoices.",
    responses={200: InvoiceSerializer(many=True)},  
)
class InvoiceListView(ListAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer



@extend_schema(
    description="Get a specific payment by its primary key.",
    request=PaymentSerializer,
    responses={200: PaymentSerializer},
)
class PaymentDetailView(RetrieveAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    lookup_field = 'pk' 



@extend_schema(
    description="Get a specific invoice by its primary key.",
    request=PaymentSerializer,
    responses={200: InvoiceSerializer},
)
class InvoiceDetailView(RetrieveAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    lookup_field = 'pk'