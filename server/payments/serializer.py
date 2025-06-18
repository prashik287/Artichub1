import pprint

from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import serializers
from Orders.models import Order
from .models import SellerPaymentInfo, Payments
import razorpay


# ✅ Get User Model
user_model = get_user_model()


# ✅ Seller Payment Info Serializer
class SellerPaymentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerPaymentInfo
        fields = "__all__"
        read_only_fields = ("id", "seller")  # Make 'seller' read-only

    def create(self, validated_data):
        request = self.context.get("request")  # Get request object
        user = request.user  # Get authenticated user

        if not user.is_authenticated:
            raise serializers.ValidationError("User is not authenticated.")

        # ✅ Ensure only sellers can add payment info
        if user.role != "artist":
            raise serializers.ValidationError(
                "Only sellers can add payment information."
            )

        # ✅ Create or update payment info for the authenticated user
        seller_payment, created = SellerPaymentInfo.objects.update_or_create(
            seller=user, defaults=validated_data
        )
        return seller_payment


# ✅ Payment Serializer
class PaymentSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), required=True)

    class Meta:
        model = Payments
        fields = "__all__"

    def create(self, validated_data):
        order = validated_data.get("order", None)

        if not order:
            raise serializers.ValidationError({"order": "❌ This field is required."})

        if not order.amount:
            raise serializers.ValidationError({"error": "❌ Order amount is missing."})

        try:
            # ✅ Corrected Razorpay Payload
            razorpay_payload = {
                "amount": int(order.amount * 100),  # Amount in paise
                "currency": "INR",
                "payment_capture": "1",
            }

            # ✅ Create Razorpay Order
            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
            razorpay_order = client.order.create(razorpay_payload)

        except Exception as e:
            raise serializers.ValidationError({"error": f"Razorpay error: {str(e)}"})

        # ✅ Create Payment Record with "PENDING" Status
        payment = Payments.objects.create(
            order=order,
            razorpay_order_id=razorpay_order["id"],
            status="PENDING",
        )
        return payment



# ✅ Payment Verification Serializer
class PaymentVerifySerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField(max_length=255)
    razorpay_payment_id = serializers.CharField(max_length=255)
    razorpay_signature = serializers.CharField(max_length=255
                                               )
