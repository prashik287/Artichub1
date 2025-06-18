import pprint

from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str, smart_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from jwt.utils import force_bytes
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.views import TokenBlacklistView
from django.core.mail import EmailMessage, send_mail

userModel = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = userModel
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "password",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        username = validated_data.get("username")

        # Check if user with same username already exists
        if userModel.objects.filter(username=username).exists():
            raise serializers.ValidationError(
                {"message": "This username is already taken."}
            )

        role = validated_data.pop("role")
        user = userModel.objects.create_user(role=role, **validated_data)
        return user


from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers

User = get_user_model()


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        # Pehle user fetch karne ki koshish kar
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"message": "No  User Account Found"})

        # Agar user hai, but inactive hai, to error return kar
        if not user.is_active:
            raise serializers.ValidationError({"message": "Account Not Activated"})

        # Ab authenticate kar user ko
        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError(
                {"message": "Incorrect username or  password"}
            )

        refresh = RefreshToken.for_user(user)
        return {
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
        }


class LogoutSerializer(serializers.Serializer):
    def post(self, data):
        refresh_token = data["refresh_token"]
        refresh_token.blacklist()
        return {"message": "Successfully logged out."}


from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken


class GetUserSerializer(serializers.Serializer):
    def validate(self, data):
        request = self.context.get("request")  # Get request context
        auth_header = request.headers.get(
            "Authorization"
        )  # Extract Authorization header

        if not auth_header or not auth_header.startswith("Bearer"):
            raise AuthenticationFailed(
                {"message": "Authorization header missing or invalid."}
            )

        try:
            token = auth_header.split(" ")[1]  # Extract token after "Bearer "
            access_token = AccessToken(token)  # Decode JWT
            user_id = access_token["user_id"]
            user = userModel.objects.get(id=user_id)
        except Exception as e:
            raise AuthenticationFailed({"message": str(e)})

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
        }


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, data):
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"message": "No User Found with this email"}
            )
        return data

    def save(self, **kwargs):
        email = self.validated_data.get("email")
        user = User.objects.get(email=email)
        uid = urlsafe_base64_encode(
            force_bytes(smart_str(user.pk))
        )  # ✅ Fix UID encoding
        token = default_token_generator.make_token(user)
        reset_url = f"http://localhost:5173/reset-password/{uid}/{token}"

        # Send email
        subject = "Password Reset Email"
        message = f"Click the link below to reset your password:\n {reset_url}"
        send_mail(subject, message, settings.EMAIL_HOST_USER, [email])
        return reset_url


class PasswordConfirmResetSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField()

    def validate(self, data):
        try:
            uid = force_str(urlsafe_base64_decode(data["uid"]))  # ✅ Fix UID decoding
            user = User.objects.get(pk=uid)
            if not default_token_generator.check_token(user, data["token"]):
                raise serializers.ValidationError(
                    {"message": "Invalid token or expired"}
                )
            data["user"] = user
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"message": "Invalid user or token"})
        return data

    def save(self):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
