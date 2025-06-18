from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.action(permissions=["deactivate"], description="Deactivate selected users")
def deactivate(self, request, queryset):
    queryset.update(is_active=False)


@admin.action(permissions=["activate"], description="Activate selected users")
def activate(self, request, queryset):
    queryset.update(is_active=True)


class CustomUserAdmin(UserAdmin):
    list_display = (
        "email",
        "username",
        "first_name",
        "last_name",
        "role",
        "is_active",
        "is_staff",
    )
    list_filter = (
        "is_active",
        "is_staff",
        "role",
    )  # ✅ Fixed: Filters should be correct field names
    search_fields = (
        "email",
        "username",
        "first_name",
        "last_name",
    )  # ✅ `role` is not searchable in this case
    ordering = ("email",)  # ✅ Fixed: Must be a tuple
    filter_horizontal = ()  # ✅ Fixed: Removed invalid field
    actions = [deactivate, activate]

    def has_deactivate_permission(self, request):
        """Ensure only superusers or staff with permissions can deactivate users."""
        return request.user.is_superuser or request.user.has_perm(
            "Account.deactivate_user"
        )

    def has_activate_permission(self, request):
        """Ensure only superusers or staff with permissions can activate users."""
        return request.user.is_superuser or request.user.has_perm(
            "Account.activate_user"
        )


# Register User with CustomUserAdmin
admin.site.register(User, CustomUserAdmin)  # ✅ Fixed: Register the model with admin
