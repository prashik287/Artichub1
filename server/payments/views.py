import hashlib
import pprint
import traceback
import hmac

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from Arts.models import ArtProduct
from .models import SellerPaymentInfo, Payments, Order
from .serializer import (
    SellerPaymentInfoSerializer,
    PaymentSerializer,
    PaymentVerifySerializer,
)

import razorpay


# ✅ Seller Payment Info View with Debugging
@method_decorator(csrf_exempt, name="dispatch")
class SellerPaymentInfoView(generics.RetrieveUpdateAPIView, generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SellerPaymentInfoSerializer

    def get(self, request, *args, **kwargs):
        print("🔍 Fetching seller payment info for:", request.user)
        try:
            seller_payment_info = SellerPaymentInfo.objects.get(seller=request.user)
            serializer = self.get_serializer(seller_payment_info)
            print("✅ Seller Payment Info Found:", serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SellerPaymentInfo.DoesNotExist:
            print("❌ Seller Payment Info Not Found!")
            raise NotFound("Payment information not found.")

    def post(self, request, *args, **kwargs):
        print("📝 Creating/Updating Seller Payment Info for:", request.user)
        if request.user.role != "artist":
            print("🚫 Permission Denied: Only artists can add payment info!")
            raise PermissionDenied("Only sellers can add payment information.")

        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            print("✅ Seller Payment Info Saved:", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("❌ Invalid Data for Payment Info:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Create Razorpay Order with Debugging
class CreateRazorpayOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("💸 Creating Razorpay Order with data:", request.data)

        # Ensure order field is provided
        if "order_id" not in request.data:
            print("Order not present")
            return Response({"error": "❌ 'order' field is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ensure order exists and belongs to the authenticated user
            order = get_object_or_404(Order, id=request.data["order_id"], buyer=request.user)
            print("✅ Order Found:", order)
        except Order.DoesNotExist:
            return Response({"error": "❌ Order not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

        # Attach order to request data
        mutable_data = request.data.copy()
        mutable_data["order"] = order.id

        serializer = PaymentSerializer(data=mutable_data)
        if serializer.is_valid():
            payment = serializer.save()
            print("✅ Payment Saved with ID:", payment.id)
            return Response(
                {
                    "order_id": payment.razorpay_order_id,
                    "amount": int(payment.order.amount * 100),
                    "currency": "INR",
                    "key": settings.RAZORPAY_KEY_ID,
                },
                status=status.HTTP_201_CREATED,
            )

        print("❌ Payment Order Creation Failed:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# ✅ Verify Razorpay Payment with Debugging
# ✅ Verify Razorpay Payment with Debugging
class VerifyPayment(APIView):
    permission_classes = [IsAuthenticated]  # ✅ Authenticated users only

    def post(self, request):
        print("🧐 Verifying Razorpay Payment...")
        pprint.pprint(request.data)

        serializer = PaymentVerifySerializer(data=request.data)
        if serializer.is_valid():
            try:
                razorpay_order_id = serializer.validated_data["razorpay_order_id"]
                razorpay_payment_id = serializer.validated_data["razorpay_payment_id"]
                razorpay_signature = serializer.validated_data["razorpay_signature"]

                print(
                    f"✅ Received Data - Order ID: {razorpay_order_id}, Payment ID: {razorpay_payment_id}"
                )

                # ✅ Get Payment Object Correctly
                try:
                    payment = get_object_or_404(
                        Payments, razorpay_order_id=razorpay_order_id
                    )
                    print(f"✅ Payment Object Found - Status: {payment.status}")
                except Exception as e:
                    print("❌ Payment Object Not Found!")
                    raise NotFound("Payment not found with this order ID.")

                # ✅ Generate Correct HMAC Signature
                generated_signature = hmac.new(
                    settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
                    f"{razorpay_order_id}|{razorpay_payment_id}".encode("utf-8"),
                    hashlib.sha256,
                ).hexdigest()

                print(f"📝 Generated Signature: {generated_signature}")
                print(f"🔍 Received Signature: {razorpay_signature}")

                # ✅ Compare Signatures Properly
                if hmac.compare_digest(generated_signature, razorpay_signature):
                    # ✅ Payment Verified - Mark as SUCCESS
                    print("✅ Payment Verification Successful!")
                    payment.razorpay_payment_id = razorpay_payment_id
                    payment.status = "SUCCESS"
                    payment.save()

                    print("✅ Returning Success Response after Verification!")
                    # ✅ Return Success Response
                    return Response(
                        {
                            "success": True,
                            "message": "✅ Payment Verified Successfully",
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    # ❌ Payment Verification Failed
                    print("❌ Payment Verification Failed! Signature Mismatch!")
                    payment.status = "FAILED"
                    payment.save()
                    return Response(
                        {"error": "❌ Payment Verification Failed"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except Exception as e:
                print("❌ Internal Server Error During Payment Verification!")
                traceback.print_exc()  # ✅ Print detailed traceback for error
                return Response(
                    {"error": f"❌ Internal Server Error: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            print("❌ Invalid Payment Verification Data:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
