import uuid
import datetime as dt
from datetime import datetime
from dateutil.relativedelta import relativedelta
from rest_framework import serializers
from django.contrib.auth import password_validation
from .models import (
    BusinessUser, 
    User, 
    BusinessClassification, 
    WithholdingTaxRate, 
    BusinessStatus, 
    Assessment,
    Payment,
    Invoice,
)

from taxapp2.users.models import LGA
from taxapp2.users.serializers import (
    LGASerializer, 
    TaxAreaSerializer, 
    WardDetailSerializer,
    is_strong_password,
)




class BusinessClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessClassification
        fields = '__all__'  

class WithholdingTaxRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithholdingTaxRate
        fields = '__all__' 

class BusinessStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessStatus
        fields = '__all__' 
    


class NewUserSerializer(serializers.ModelSerializer):
    location = LGASerializer()
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'phone', 'location','is_staff', 'is_active') 




class NewCreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name', 'user_role', 'phone', 'location')
        extra_kwargs = {'location': {'queryset': LGA.objects.all()}}  

    def validate(self, attrs):
        password = attrs.get('password')
        if not is_strong_password(password):
            raise serializers.ValidationError("Password is not strong enough. Password must contain 8 characters, with uppercase, lowercase, digit and symbol.")

        # Check for missing first_name or last_name if a single name is provided
        if not attrs.get('first_name') and not attrs.get('last_name'):
            full_name = attrs.get('full_name')
            if full_name:
                # Split the single name (assuming a space separator)
                parts = full_name.split(' ', 1)
                attrs['first_name'] = parts[0]
                if len(parts) > 1:
                    attrs['last_name'] = parts[1]
                else:
                    # Raise a specific validation error for missing last name
                    raise serializers.ValidationError("A single name was provided. Please provide both first and last name, or separate them with a space.")
            else:
                # Raise a generic validation error for missing full_name
                raise serializers.ValidationError("Please provide a full name, including both first and last name.")
        return attrs


class BusinessUserSerializer(serializers.ModelSerializer):
    user = NewCreateUserSerializer(required=True)

    class Meta:
        model = BusinessUser
        fields = (
            'user', 
            'business_name', 
            'classification', 
            'withholding_tax_rate', 
            'business_status', 
            'tax_area', 
            'anual_income', 
            'type', 
            'ward',
            )

    def create(self, validated_data):
        tax_id = str(uuid.uuid4())
        user_data = validated_data.pop('user')
        user_data['username'] = user_data['email']
        user = User.objects.create_user(**user_data)
        business_user = BusinessUser.objects.create(user=user,tax_id=tax_id ,**validated_data)
        today = dt.datetime.today().strftime("%Y%m%d")
        user_id = str(business_user.id)
        new_user_id = user_id[-4:] if len(user_id) >= 4 else user_id.zfill(4)
        business_user.tax_id = f"JG{today}{new_user_id}"
        business_user.save()
        
        return business_user

    def validate(self, attrs):
        email = attrs['user']['email']
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")
        return attrs
   



class BusinessUserRetrieveListSerializer(serializers.ModelSerializer):
    user = NewUserSerializer()
    classification = BusinessClassificationSerializer()
    withholding_tax_rate = WithholdingTaxRateSerializer()
    business_status = BusinessStatusSerializer()
    tax_area = TaxAreaSerializer()
    ward = WardDetailSerializer()
    class Meta:
        model = BusinessUser
        fields = (
            'id',
            'tax_id',
            'user',
            'business_name', 
            'classification', 
            'withholding_tax_rate', 
            'business_status',
            'tax_area',
            'anual_income',
            'type',
            'ward',
            )


class BusinessUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUser
        fields = (
            'business_name', 
            'classification', 
            'withholding_tax_rate',
            'business_status',
            'type',
            'tax_area',
            'anual_income',
            'ward',
            )


# Assesment and audit

class AssessmentSerializer(serializers.ModelSerializer):
    user = BusinessUserRetrieveListSerializer()
    class Meta:
        model = Assessment
        fields = '__all__'  


class UpdateAssessment_AssessmentOfficerSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Assessment
        fields = ('to_be_paid', 'tax_due_time')
    
    def update(self, instance, validated_data):
        """
        Updates the assessment instance and updates BusinessUser status.
        """
        assessment = instance
        assessment.to_be_paid = validated_data['to_be_paid']
        assessment.tax_due_time = validated_data['tax_due_time']
        # temporary set to approved.. i,e. no need for audit to query and subsequently approve
        # also update assessement due date
        assessment.assessment_status = 'approved'
        today = datetime.now().date()
        if assessment.tax_due_time == 'annually':
            assessment.next_due_date =  today + relativedelta(years=1)
        elif assessment.tax_due_time == 'monthly':
            assessment.next_due_date = today + relativedelta(months=1)
        else:
            assessment.next_due_date = today + relativedelta(days=1)
        assessment.save()
         
        #temporary create invoice; previousely had to be approved for invoice to be created
        if Invoice.objects.filter(taxpayer=assessment.user):
            pass
        else:
            invoice = Invoice.objects.create(
            taxpayer=assessment.user,
            amount=assessment.to_be_paid, 
            due_date=assessment.next_due_date
            )
            invoice.save()
        return assessment


class UpdateAssessment_AuditOfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = ['query']

    def update(self, instance, validated_data):
        assessment = instance
        assessment.query = validated_data['query']
        assessment.assessment_status = 'query'
        assessment.save()
        return assessment


class PaymentSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'  # Include all fields (adjust as needed)


class InvoiceSerializer(serializers.ModelSerializer):
    payment_reciept = PaymentSerializer(many=True, read_only=True, source='invoice_payment_receipt')

    class Meta:
        model = Invoice
        fields = '__all__'


class InitPaymentInvoiceSerializer(serializers.Serializer):
    invoice_id = serializers.IntegerField()
    

class PaymentResponseSerializer(serializers.Serializer):
    message = serializers.CharField(read_only=True)
    redirect_url = serializers.CharField(read_only=True)


class ManualPaymentVerificationSerializer(serializers.Serializer):
    transaction_id = serializers.CharField(required=True)
    invoice_id = serializers.IntegerField(required=False)
    tx_ref = serializers.CharField(required=False)