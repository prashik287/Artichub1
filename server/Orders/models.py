from django.db import models
from django.contrib.auth import get_user_model
from Arts.models import ArtProduct  # ✅ Correct

User = get_user_model()


class Order(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
    ]

    buyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders_from_orders_app",  # ✅ Fixed related_name
    )
    art = models.ForeignKey(
        ArtProduct,
        on_delete=models.CASCADE,
        related_name="orders_from_orders_app",  # ✅ Fixed related_name
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    payment_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.status}"
