from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ('username', )



class CreateUserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'phone', 'staff_id', 'staff_role','full_name')

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        first_name, last_name = full_name.split()
        validated_data['first_name'] = first_name
        validated_data['last_name'] = last_name
        user = User.objects.create_user(**validated_data)
        return user

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