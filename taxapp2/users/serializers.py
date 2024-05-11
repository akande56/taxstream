import uuid
from django.contrib.auth.models import Group
from rest_framework import serializers
from drf_spectacular.utils import extend_schema
from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'



class CreateUserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'phone', 'staff_role','full_name')

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        first_name, last_name = full_name.split()
        validated_data['first_name'] = first_name
        validated_data['last_name'] = last_name
        # generate unique staff ID
        validated_data['staff_id'] = str(uuid.uuid4())
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


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.CharField()
    name = serializers.CharField()
    class Meta:
        model = Group
        fields = ['url', 'name']

# class CreateUserSerializer(serializers.ModelSerializer):

#     def create(self, validated_data):
#         # call create_user on user object. Without this
#         # the password will be stored in plain text.
#         user = User.objects.create_user(**validated_data)
#         return user

#     class Meta:
#         model = User
#         fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email')
#         # read_only_fields = ('auth_token',)
#         extra_kwargs = {'password': {'write_only': True}}


class EmailSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=255)
    message = serializers.CharField()
    recipient_email = serializers.EmailField()
    from_email = serializers.EmailField()

class CustomEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
