from django.urls import path

from .views import (
    CreateOrder,
    OrderDetail,
    MyOrders,
    OrderStatusUpdateAPIView,
    UpdateOrderStatus,
)

urlpatterns = [
    path("create/", CreateOrder.as_view(), name="create"),
    path("<int:pk>/", OrderDetail.as_view(), name="detail"),
    path("myorders/", MyOrders.as_view(), name="myorders"),
    path(
        "order/orderstatus/<int:pk>/", UpdateOrderStatus.as_view(), name="orderstatus"
    ),
]
