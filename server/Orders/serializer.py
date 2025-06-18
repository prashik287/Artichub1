import uuid
from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework import serializers
from Arts.models import ArtProduct
from .models import Order
import pprint

User = get_user_model()


class OrderSerializer(serializers.ModelSerializer):
    buyer = serializers.CharField(required=True)  # ✅ Buyer field required

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ["id", "created_at", "status"]

    def create(self, validated_data):
        print("Validated Data :", validated_data)
        buyer_id = validated_data.pop("buyer", None)
        print("Validate Data : ", validated_data)

        # ✅ Check if buyer_username is provided
        if not buyer_id:
            raise serializers.ValidationError({"buyer": "❌ Buyer field is required."})

        # ✅ Fetch User instance
        try:
            buyer = User.objects.get(id=buyer_id)
            if buyer.role == "artist":
                raise serializers.ValidationError({"seller": "Only buyer can  order"})
        except User.DoesNotExist:
            raise serializers.ValidationError({"buyer": "❌ Invalid buyer username."})

        # ✅ Fetch ArtProduct instance by I
        art_id = validated_data.pop("art", None)
        pprint.pprint(art_id)

        # ✅ Fetch quantity & amount safely
        try:
            quantity = int(validated_data.pop("quantity", 1))  # Default 1
            amount = Decimal(
                validated_data.pop("amount", 0)
            )  # ✅ Use Decimal for amount
            pprint.pprint(art_id)
            # ✅ Create Order with correct art instance
            order = Order.objects.create(
                buyer=buyer,
                art=art_id,  # ✅ Correctly pass art instance here
                # quantity=quantity,
                amount=amount,  # ✅ Pass Decimal amount
            )

            print(f"✅ Order Created: {order}")  # ✅ Debugging print
            return order
        except Exception as e:
            print(f"❌ Exception Occurred: {e}")
            raise serializers.ValidationError(
                {"error": f"❌ Order creation failed: {e}"}
            )
