import uuid
from django.contrib.auth.models import Group
from rest_framework import serializers
from drf_spectacular.utils import extend_schema
from .models import (
    User,
    State,
    LGA,
    Ward,
    TaxArea,
    Statesupervisor,
    LGAsupervisor,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'phone',
            'first_name',
            'last_name',
            'location',
            'is_active',
            'is_superuser',
            'is_staff',
            'user_role',
            'date_joined',
            'groups',
            'user_permissions',
            )



class CreateUserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'phone', 'user_role','full_name', 'location')

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        first_name, last_name = full_name.split()
        validated_data['first_name'] = first_name
        validated_data['last_name'] = last_name
        validated_data['is_staff'] = True
        validated_data['username'] = validated_data['email']
        # generate unique staff ID
        # validated_data['staff_id'] = str(uuid.uuid4())
        user = User.objects.create_user(**validated_data)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)
    
    def validate(self, attrs):
        
        new_password1 = attrs.get('new_password1')
        new_password2 = attrs.get('new_password2')
        if not new_password1:
            raise serializers.ValidationError({'new_password1': 'This field is required.'})
        if not new_password2:
            raise serializers.ValidationError({'new_password2': 'This field is required.'})
        if new_password1 != new_password2:
            raise serializers.ValidationError({'password_mismatch': 'Passwords do not match..'})

        return attrs


class GroupSerializer(serializers.ModelSerializer):
    # url = serializers.CharField()
    url = serializers.HyperlinkedIdentityField(view_name='group-detail')
    name = serializers.CharField()
    class Meta:
        model = Group
        fields = ['url','name', 'pk']


class StateSerializer(serializers.ModelSerializer):
    # supervisor1 = serializers.SlugRelatedField(
    #     slug_field='username', queryset=User.objects.filter(groups__name='supervisor1'), required=False, 
    #     help_text = 'username for User Object'
    # )
    class Meta:
        model = State
        fields = ('id', 'name')


class LGASerializer(serializers.ModelSerializer):
    # state = StateSerializer()
    state = serializers.PrimaryKeyRelatedField(queryset=State.objects.all()) 
    # supervisor2 = serializers.SlugRelatedField(
    #     slug_field='username', queryset=User.objects.filter(groups__name='supervisor2'), required=False
    # )
    class Meta:
        model = LGA
        fields = ('id', 'name', 'code', 'state')


class LGAsupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = LGAsupervisor
        fields = '__all__'

class StatesupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statesupervisor
        fields = '__all__'



class WardSerializer(serializers.ModelSerializer):
    # lga = LGASerializer(read_only=True)
    class Meta:
        model = Ward
        fields = ('id', 'area_name', 'area_code', 'lga', 'status')

class TaxAreaSerializer(serializers.ModelSerializer):
    # ward = WardSerializer(read_only=True)  # Nested serializer for ward information

    class Meta:
        model = TaxArea
        fields = ['id', 'ward', 'tax_area_office', 'tax_area_code']




class UserListSerializer(serializers.ModelSerializer):
    location = LGASerializer()
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'phone',
            'first_name',
            'last_name',
            'location',
            'is_active',
            'is_superuser',
            'is_staff',
            'user_role',
            'date_joined',
            'groups',
            'user_permissions',
            )


class EmailSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=255)
    message = serializers.CharField()
    recipient_email = serializers.EmailField()
    from_email = serializers.EmailField()


class CustomEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['user'] = {
            'id': self.user.pk,
            'username': self.user.username,
            'email': self.user.email,
        }
        data['refresh'] = str(refresh)
        return data