from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, Group
from django.db import models
from django.utils.timezone import now


class UserManager(BaseUserManager):
    def create_user(
        self,
        email,
        password=None,
        role=None,
        username=None,
        first_name=None,
        last_name=None,
    ):
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            first_name=first_name,
            last_name=last_name,
            role=role,
        )
        user.set_password(password)
        user.is_active = False
        user.save(using=self._db)
        return user

    def create_superuser(
        self,
        email,
        password,
        username="admin",
        first_name="Super",
        last_name="User",
        role="admin",
    ):
        user = self.create_user(
            email=email,
            password=password,
            username=username,
            first_name=first_name,
            last_name=last_name,
            role=role,
        )
        user.role = "admin"
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True  # ✅ FIXED: Superuser should be active
        user.save(using=self._db)
        return user

    def get_by_natural_key(self, username):  # ✅ FIXED: Now uses username
        return self.get(username=username)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("customer", "Customer"),
        ("artist", "Artist"),
    )
    reset_token = models.CharField(max_length=100, blank=True, null=True)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    role = models.CharField(max_length=255, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    groups = models.ManyToManyField(Group, related_name="custom_users", blank=True)
    date_joined = models.DateTimeField(default=now)
    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "first_name", "last_name", "role"]

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
