from django.urls import path
from .views import ArtAuctions

urlpatterns = [
    path('auctions/', ArtAuctions.as_view(), name='auction'),
]