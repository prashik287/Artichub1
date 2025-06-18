from django.urls import path
from .views import (
    RegisterView,
    activate,
    Login_View,
    InfoView,
    Logout_View,
    PasswordResetView,
    PasswordResetConfirmView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path(
        "activate/<uidb64>/<token>/",
        activate,
        name="activate",
    ),
    path("login/", Login_View.as_view(), name="login"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("info/", InfoView.as_view(), name="info"),
    path("logout/", Logout_View.as_view(), name="logout"),
    path("password-reset/", PasswordResetView.as_view(), name="password-reset"),
    path(
        "password-reset-confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),  # ✅ Fix incorrect view reference
]
