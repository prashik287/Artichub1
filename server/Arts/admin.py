from re import search

from django.contrib import admin
from .models import ArtProduct


# Register your models here.
class ArtAdmin(admin.ModelAdmin):
    search_fields = ["title"]
    list_display = ["title", "seller", "price"]
    list_filter = ["seller", "saleType", "yearCreation"]


admin.site.register(ArtProduct, ArtAdmin)
