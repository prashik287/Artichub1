from django.contrib import admin
from .models import SellerPaymentInfo, Payments

# Register your models here.
admin.site.register(SellerPaymentInfo)
admin.site.register(Payments)
