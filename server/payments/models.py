from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth import get_user_model
from Arts.models import ArtProduct
from Orders.models import Order

User = get_user_model()


class SellerPaymentInfo(models.Model):
    PAYMENT_METHODS = [
        ("razorpay", "Razorpay"),
    ]

    seller = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="payment_info"
    )
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    account_holder_name = models.CharField(max_length=255)
    upi_id = models.CharField(max_length=100, blank=True, null=True)
    bank_account_number = models.CharField(max_length=50, blank=True, null=True)
    ifsc_code = models.CharField(max_length=20, blank=True, null=True)
    paypal_email = models.EmailField(blank=True, null=True)
    is_default = models.BooleanField(default=True)

    def clean(self):
        if self.seller.role != "Artist":
            raise ValidationError(
                "SellerPaymentInfo can only be used with Razorpay by Seller"
            )

    def __str__(self):
        return f"{self.seller.username} - {self.payment_method}"


class Payments(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="payments",
    )
    razorpay_order_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"payments for order {self.order} - {self.status}"


#
# class Order(models.Model):
#     buyer = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name="orders_from_payments_app",  # ✅ Unique related_name
#     )
#     product = models.ForeignKey(
#         ArtProduct,
#         on_delete=models.CASCADE,
#         related_name="orders_from_payments_app",  # ✅ Unique related_name
#     )
#     quantity = models.PositiveIntegerField()
#     total_price = models.DecimalField(max_digits=10, decimal_places=2)
#     status = models.CharField(
#         max_length=10,
#         choices=[
#             ("PENDING", "Pending"),
#             ("COMPLETED", "Completed"),
#             ("CANCELLED", "Cancelled"),
#         ],
#         default="PENDING",
#     )
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     def __str__(self):
#         return f"Order {self.id} - {self.status}"
