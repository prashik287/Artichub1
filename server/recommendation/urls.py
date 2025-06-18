# ml_model/urls.py
from django.urls import path
from .views import RecommendProductsView


urlpatterns = [
    path('recommendations/', RecommendProductsView.as_view(), name='recommendations'),
]
