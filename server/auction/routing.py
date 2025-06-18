# auction/routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/auction/<int:item_id>/", consumers.AuctionConsumer.as_asgi()),
]
