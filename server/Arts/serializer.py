import jwt
import self
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.encoding import smart_str
from django.views.decorators.http import condition
from numpy.ma.core import product
from rest_framework import serializers
from rest_framework_simplejwt.tokens import AccessToken
from .models import ArtProduct
from Orders.models import Order

user_model = get_user_model()


class ArtSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtProduct
        fields = [
            "title", "yearCreation", "signed", "condition", "period",
            "category", "image", "quantity", "saleType", "auctionStartDate",
            "auctionEndDate", "price", "bids", "highestBid"
        ]
        extra_kwargs = {
            'title': {'required': True},
            'price': {'required': True},
            'condition': {'required': True},
            'yearCreation': {'required': True}
        }

    def create(self, validated_data):
        # Get user from request context
        user = self.context['request'].user

        # Check for existing title
        if ArtProduct.objects.filter(title=validated_data.get("title")).exists():
            raise serializers.ValidationError({"message": "This title is already taken."})

        # Create art product
        art = ArtProduct.objects.create(
            seller=user,
            **validated_data
        )
        return art

class AllArtProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = ArtProduct
        fields = ["id", "title", "price", "category", "image", "saleType"]
        read_only_fields = ("id",)


import razorpay
from django.conf import settings
from Orders.models import Order
from .models import ArtProduct
from rest_framework import serializers


class ArtDetailSerializer(serializers.ModelSerializer):
    purchase_quantity = serializers.IntegerField(
        write_only=True, required=False, min_value=1
    )

    class Meta:
        model = ArtProduct
        fields = [
            "id",
            "title",
            "yearCreation",
            "signed",
            "condition",
            "period",
            "category",
            "image",
            "quantity",
            "saleType",
            "auctionStartDate",
            "auctionEndDate",
            "price",
            "bids",
            "highestBid",
            "reviews",
            "purchase_quantity",
        ]

    def update(self, instance, validated_data):
        purchase_quantity = validated_data.pop("purchase_quantity", None)
        user = self.context["request"].user

        if purchase_quantity:
            if instance.quantity < purchase_quantity:
                raise serializers.ValidationError(
                    {"message": "Not enough quantity available."}
                )

            # ✅ Reduce quantity after purchase
            instance.quantity -= purchase_quantity
            instance.save()

            # ✅ Create Order after successful purchase
            order = Order.objects.create(
                buyer=user,
                product=instance,
                quantity=purchase_quantity,
                total_price=purchase_quantity * instance.price,
            )

            # ✅ Call Razorpay Payment after Order Creation
            payment_response = self.create_payment(order)

            # Add payment details to response
            return {
                "order": order.id,
                "payment": payment_response,
            }

        return super().update(instance, validated_data)

    def create_payment(self, order):
        """Generate Razorpay Order Automatically After Order Creation"""
        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        # Razorpay Order Data
        data = {
            "amount": int(order.total_price * 100),  # Amount in paise
            "currency": "INR",
            "receipt": f"order_rcptid_{order.id}",
        }
        razorpay_order = client.order.create(data=data)

        # Save Razorpay Order ID in Order
        order.payment_id = razorpay_order["id"]
        order.status = "PENDING"
        order.save()

        return {
            "order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "key": settings.RAZORPAY_KEY_ID,
        }
