from django.urls import path
from .views import AddArtView,  SingleArt, ArtSaleView, PurchaseArtView,ArtReviewView,SellerArtView

urlpatterns = [
    path("add/", AddArtView.as_view(), name="add"),
    # path("all/", AllArts.as_view(), name="all"),
    path("<int:pk>/", SingleArt.as_view(), name="single"),
    path("sale/", ArtSaleView.as_view(), name="saleart"),
    path("purchase/<int:pk>/", PurchaseArtView.as_view(), name="purchase"),
    path("comments/<int:pk>/",ArtReviewView.as_view(), name="art_comment"),
    path("seller/",SellerArtView.as_view(), name="seller"),

]
