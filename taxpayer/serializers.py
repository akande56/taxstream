import uuid
from rest_framework import serializers
from django.contrib.auth import password_validation
from .models import BusinessUser, User, BusinessClassification, WithholdingTaxRate, BusinessStatus
from taxapp2.users.serializers import CreateUserSerializer
from taxapp2.users.models import LGA
from taxapp2.users.serializers import LGASerializer




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
    password = serializers.CharField(write_only=True, required=True, validators=[password_validation.validate_password])

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name', 'user_role', 'phone', 'location')
        extra_kwargs = {'location': {'queryset': LGA.objects.all()}}  

class BusinessUserSerializer(serializers.ModelSerializer):
    user = NewCreateUserSerializer(required=True)
    

    class Meta:
        model = BusinessUser
        fields = ('user', 'business_name', 'classification', 'withholding_tax_rate', 'business_status', 'tax_area', 'anual_income', 'type')

    def create(self, validated_data):
        tax_id = str(uuid.uuid4())
        user_data = validated_data.pop('user')
        user_data['username'] = user_data['email']
        user = User.objects.create_user(**user_data)
        business_user = BusinessUser.objects.create(user=user,tax_id=tax_id ,**validated_data)
        return business_user

    # def validate(self, attrs):
    #     # Custom validation (optional)
    #     # For example, ensure user with the same username doesn't exist
    #     username = attrs['user']['username']
    #     if User.objects.filter(username=username).exists():
    #         raise serializers.ValidationError("Username already exists")
    #     return attrs
   



class BusinessUserRetrieveListSerializer(serializers.ModelSerializer):
    user = NewUserSerializer()
    classification = BusinessClassificationSerializer()
    withholding_tax_rate = WithholdingTaxRateSerializer()
    business_status = BusinessStatusSerializer()
    class Meta:
        model = BusinessUser
        fields = ('id', 'user', 'business_name', 'classification', 'withholding_tax_rate', 'business_status')


class BusinessUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUser
        fields = ('business_name', 'classification', 'withholding_tax_rate', 'business_status')