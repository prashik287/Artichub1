from django.urls import path
from .views import SellerPaymentInfoView, CreateRazorpayOrder, VerifyPayment

urlpatterns = [
    path(
        "seller/payment-info/",
        SellerPaymentInfoView.as_view(),
        name="seller-payment-info",
    ),
    path(
        "razorpay/create/", CreateRazorpayOrder.as_view(), name="create-razorpay-order"
    ),
    path(
        "razorpay/verify/",
        VerifyPayment.as_view(),
        name="verify_payment",
    ),
]
