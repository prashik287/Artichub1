from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ArtProduct
from .serializer import ArtSerializer, ArtDetailSerializer
import pprint
import requests
from PIL import Image
import json
from io import BytesIO
from Orders.models import Order
from Orders.serializer import OrderSerializer
from PIL import Image, ImageDraw, ImageFont
import io

# Infura IPFS Credentials
INFURA_PROJECT_ID = "2SwPhMXE3reAaCZcDidzzgtKsrk"
INFURA_PROJECT_SECRET = "76b437033d64b30cf95b31685c7b8526"
INFURA_API_URL = "https://ipfs.infura.io:5001/api/v0/add"


class AddArtView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Add request context to serializer
        serializer = ArtSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class SingleArt(APIView):
#     permission_classes = [AllowAny]
#     def get(self, request, pk):
#         art = get_object_or_404(ArtProduct, id=pk)
#         serializer = ArtDetailSerializer(art)
#         pprint.pprint(rserializer.data['image'])
#         image_url = serializer.data['image']
#         return Response(serializer.data, status=status.HTTP_200_OK)
from PIL import ImageFont
class SingleArt(APIView):
    permission_classes = [AllowAny]

    def add_copyright_watermark(self, image):
        """Adds a copyright watermark to the center of the image."""
        draw = ImageDraw.Draw(image)

        try:
            font = ImageFont.truetype("arial.ttf", 40)  # This fails if Arial isn't installed
        except OSError:
            font = ImageFont.load_default()  # Fallback font

        text = "© Copyright Protected  |  Artichub"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width, text_height = bbox[2] - bbox[0], bbox[3] - bbox[1]

        width, height = image.size
        position = ((width - text_width) // 2, (height - text_height) // 2)

        draw.text(position, text, fill=(255, 255, 255, 128), font=font)
        return image

    def upload_to_ipfs(self, image):
        """Uploads image to IPFS via Infura."""
        image_io = io.BytesIO()
        image.save(image_io, format="PNG")
        image_io.seek(0)

        response = requests.post(
            INFURA_API_URL,
            files={"file": image_io},
            auth=(INFURA_PROJECT_ID, INFURA_PROJECT_SECRET),
        )

        if response.status_code == 200:
            ipfs_hash = response.json()["Hash"]
            ipfs_url = f"https://ipfs.io/ipfs/{ipfs_hash}"
            return ipfs_url
        else:
            return None

    def get(self, request, pk):
        """Fetches an
         image, adds a copyright, and uploads to IPFS."""
        art = get_object_or_404(ArtProduct, id=pk)
        serializer = ArtDetailSerializer(art)

        image_url = serializer.data.get("image")
        if not image_url:
            return Response({"error": "Image URL not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Download image
        response = requests.get(image_url)
        if response.status_code != 200:
            return Response({"error": "Failed to download image"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Open image & Add watermark
        image = Image.open(io.BytesIO(response.content))
        watermarked_image = self.add_copyright_watermark(image)

        # Step 3: Upload to IPFS
        ipfs_url = self.upload_to_ipfs(watermarked_image)
        pprint.pprint(ipfs_url)
        if not ipfs_url:
            return Response({"error": "IPFS upload failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Return original data + IPFS URL
        response_data = serializer.data
        response_data["image"] = ipfs_url

        return Response(response_data, status=status.HTTP_200_OK)

class ArtSaleView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = ArtProduct.objects.filter(saleType="Sell")
        serializer = ArtSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PurchaseArtView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            art = ArtProduct.objects.get(pk=pk)
        except ArtProduct.DoesNotExist:
            return Response({"message": "Art not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ArtDetailSerializer(art, data=request.data, context={"request": request}, partial=True)

        if serializer.is_valid():
            result = serializer.save()
            if "payment" in result:
                return Response({
                    "message": "Order created and payment initiated.",
                    "order_id": result["order"],
                    "payment_data": result["payment"],
                }, status=status.HTTP_201_CREATED)

            return Response({"message": "Order created, but no payment initiated."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ArtReviewView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, pk):
        try:
            art = ArtProduct.objects.get(pk=pk)
        except ArtProduct.DoesNotExist:
            return Response({"message": "Art not found."}, status=status.HTTP_404_NOT_FOUND)

        email = request.data.get("email")
        comment = request.data.get("comment")

        if not email or not comment:
            return Response({"message": "Email and comment are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure reviews is a list
        if not art.reviews:
            art.reviews = []

        art.reviews.append({"email": email, "comment": comment})
        art.save()

        return Response(ArtDetailSerializer(art).data, status=status.HTTP_200_OK)
q
    def get(self, request, pk):
        try:
            art = ArtProduct.objects.get(pk=pk)
            return Response(art.reviews, status=status.HTTP_200_OK)
        except ArtProduct.DoesNotExist:
            return Response({"message": "Art not found."}, status=status.HTTP_404_NOT_FOUND)

class SellerArtView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        queryset = ArtProduct.objects.filter(seller_id=request.user.id).filter(saleType="Sell")
        serializer = ArtSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

