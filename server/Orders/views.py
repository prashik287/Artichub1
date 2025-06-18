import pprint

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from Arts.models import ArtProduct
from .models import Order
from .serializer import OrderSerializer


# Create Order API
# views.py
# views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order
from Arts.models import ArtProduct
from .serializer import OrderSerializer
import pprint


class CreateOrder(APIView):
    permission_classes = [IsAuthenticated]  # ✅ Corrected syntax

    def post(self, request):
        pprint.pprint(request.data)
        print("Requested data:", request.data)
        if not request.user.is_authenticated:
            return Response({"error": "❌ Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)  # ✅ Explicit check
        print("User id :",request.user.id)
        serializer = OrderSerializer(data=request.data)  # ✅ Ensure user context

        if serializer.is_valid():
            order = serializer.save(buyer=request.user.id)  # ✅ Ensure buyer is set
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Get Order API (Single Order)
class OrderDetail(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        if order.buyer != request.user and order.seller != request.user:
            return Response(
                {"error": "You do not have permission to view this order."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Get All Orders for a Specific Buyer
class MyOrders(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("My oRdets")
        orders = Order.objects.filter(
            buyer=request.user.id
        )  # ✅ Fetch orders for the logged-in user
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Update Order Status API (Dynamically update to any valid status)
class OrderStatusUpdateAPIView(APIView):
    def patch(self, request, pk):  # ✅ Change 'id' to 'pk'
        order = get_object_or_404(Order, id=pk)  # ✅ Use 'pk' for consistency
        serializer = OrderSerializer(order, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.update()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateOrderStatus(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            pprint.pprint(f"Order ID: {pk}")
            order = get_object_or_404(Order, id=pk)  # Fetch order safely

            pprint.pprint(f"Status Update: {order.status}")

            # ✅ Get new status from request data
            new_status = request.data.get("status",None)
            if not new_status:
                return Response(
                    {"error": "❌ Status field is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ✅ Validate status
            valid_statuses = ["PENDING", "PAID", "FAILED", "SHIPPED", "DELIVERED"]
            if new_status not in valid_statuses:
                return Response(
                    {"error": "❌ Invalid status provided."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ✅ Update order status
            order.status = new_status
            order.save()
            pprint.pprint(order.status)
            # ✅ Handle stock update for ArtProduct (assuming order has an 'art_product' relation)
            if hasattr(order, "art_product"):  # Check if order has related art_product
                art_product = order.art_product
                if art_product.quantity > 0:
                    art_product.quantity -= 1
                    art_product.save()
                else:
                    return Response(
                        {"error": "❌ Out of stock."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            return Response(
                {"success": f"✅ Order status updated to '{new_status}'."},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            print("Error updating order:", str(e))
            return Response(
                {"error": f"❌ Failed to update order status: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )