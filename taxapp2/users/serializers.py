import uuid
from django.contrib.auth.models import Group
from rest_framework import serializers
from drf_spectacular.utils import extend_schema
from .models import (
    User,
    State,
    LGA,
    Ward,
    WardAndMonitor,
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



class CreateStaffSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=255, required=True)
    ward = serializers.PrimaryKeyRelatedField(queryset=Ward.objects.all(), required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'phone', 'user_role','full_name', 'location', 'ward')

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        first_name, last_name = full_name.split()
        validated_data['first_name'] = first_name
        validated_data['last_name'] = last_name
        validated_data['is_staff'] = True
        validated_data['username'] = validated_data['email']
        # generate unique staff ID
        # validated_data['staff_id'] = str(uuid.uuid4())
        ward = validated_data.pop('ward', None)
        user = User.objects.create_user(**validated_data)

        if ward and validated_data['user_role'] == 'ward_monitor':
            ward_monitor_user, _ = WardAndMonitor.objects.get_or_create(ward=ward, ward_monitor=user)
            validated_data['ward_monitor'] = ward_monitor_user
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
    class Meta:
        model = Ward
        fields = ('id', 'area_name', 'area_code', 'lga', 'status')


class TaxAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxArea
        fields = ['id', 'ward', 'tax_area_office', 'tax_area_code']


class WardDetailSerializer(serializers.ModelSerializer):
    lga = LGASerializer(read_only=True) 
    wards_in_taxArea = TaxAreaSerializer(many=True, read_only=True)
    class Meta:
        model = Ward
        fields = ('id', 'area_name', 'area_code', 'lga', 'status', 'wards_in_taxArea')

class TaxAreaDetailSerializer(serializers.ModelSerializer):
    ward = WardDetailSerializer(read_only=True) 
    class Meta:
        model = TaxArea
        fields = ['id', 'ward', 'tax_area_office', 'tax_area_code']


class LGADetailSerializer(serializers.ModelSerializer):
    state = serializers.PrimaryKeyRelatedField(queryset=State.objects.all())
    lgas_in_ward = WardSerializer(many = True, read_only = True)
    class Meta:
        model = LGA
        fields = ('id', 'name', 'code', 'state', 'lgas_in_ward')




class WardAndMonitorSerializer(serializers.ModelSerializer):
    ward = serializers.SlugRelatedField(slug_field='area_name', read_only=True)
    ward_monitor = serializers.SlugRelatedField(slug_field='username', read_only=True)

    class Meta:
        model = WardAndMonitor
        fields = ('pk', 'ward', 'ward_monitor')


class UserListSerializer(serializers.ModelSerializer):
    location = LGASerializer()
    ward_monitor = WardAndMonitorSerializer(read_only=True, source='ward_monitor.first')  # Access via related set
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
            'ward_monitor',
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

