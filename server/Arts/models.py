from django.conf import settings
from django.db import models
from django.db.models import JSONField


User = settings.AUTH_USER_MODEL


class ArtProduct(models.Model):
    """
    Represents an art product.
    """

    seller = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="art_products",
        limit_choices_to={"role": "artist"},
    )  # Foreign key to Artist users

    title = models.CharField(max_length=255)
    yearCreation = models.CharField(null=True, blank=True,max_length=255)
    signed = models.BooleanField(default=False)  # Boolean conversion for "Signed"
    condition = models.CharField(max_length=755, blank=True, null=True)
    period = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=255, blank=True, null=True)
    image = models.URLField(blank=True, null=False)
    t2ype = models.CharField(max_length=255, blank=False, null=True, choices=[
            ("painting", "Painting"),
            ("sculpture", "Sculpture"),
            ("photography", "Photography"),
            ("digital", "Digital")
        ])
    quantity = models.PositiveIntegerField(default=1)

    saleType = models.CharField(
        max_length=255,
        choices=[("Sale", "Sale"), ("Auction", "Auction")],
        default="Sale",
    )

    auctionStartDate = models.DateTimeField(null=True, blank=True)
    auctionEndDate = models.DateTimeField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # New fields
    bids = JSONField(default=list, blank=True, null=True)  # Store bid data
    highestBid = models.JSONField(blank=True, null=True)  # Store highest bid details
    reviews = JSONField(default=list, blank=True, null=True)  # Store reviews

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Art Product"
        verbose_name_plural = "Art Products"
