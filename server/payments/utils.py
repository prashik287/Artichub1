import razorpay
from django.conf import settings


def create_payment(order):
    """Generate Razorpay Order After Order Creation"""
    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

    # ✅ Razorpay Order Data
    data = {
        "amount": int(order.total_price * 100),  # Amount in paise
        "currency": "INR",
        "receipt": f"order_rcptid_{order.id}",
    }
    razorpay_order = client.order.create(data=data)

    # ✅ Save Razorpay Order ID in Order
    order.payment_id = razorpay_order["id"]
    order.status = "PENDING"
    order.save()

    return {
        "order_id": razorpay_order["id"],
        "amount": razorpay_order["amount"],
        "currency": razorpay_order["currency"],
        "key": settings.RAZORPAY_KEY_ID,
    }


def get_payment_data(order):
    """Return Razorpay Payment Data After Order Creation"""
    if order.payment_id:
        return {
            "order_id": order.payment_id,
            "amount": int(order.total_price * 100),
            "currency": "INR",
            "key": settings.RAZORPAY_KEY_ID,
        }
    return None
