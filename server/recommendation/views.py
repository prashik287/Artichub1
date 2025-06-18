from django.shortcuts import render

# Create your views here.
# ml_model/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .modal_loader import recommend_products,get_products_from_db
from .serializer import PredictionInputSerializer
from Arts.models import ArtProduct
  # Load model once for reuse
from rest_framework.permissions import AllowAny


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Arts.models import ArtProduct
from .modal_loader import recommend_products# Importing the updated recommendation function

class RecommendProductsView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        user_product_id = request.data.get('product_id')

        if not user_product_id:
            return Response({'error': '⚠️ Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert product ID to integer if needed
            user_product_id = int(user_product_id)

            # Get recommended product IDs using the updated function
            recommended_product_ids = recommend_products(user_product_id)

            if not recommended_product_ids:
                return Response({'message': 'No similar products found.'}, status=status.HTTP_200_OK)

            # Fetch recommended products from the database
            recommended_products = ArtProduct.objects.filter(id__in=recommended_product_ids)

            recommended_products_data = [
                {
                    'id': product.id,
                    'title': product.title,
                    'period': product.period,
                    'category': product.category,
                    'price': product.price,
                    'yearCreation': product.yearCreation,
                    'image':product.image,
                    'signed': product.signed
                }
                for product in recommended_products
            ]

            return Response({'recommended_products': recommended_products_data}, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({'error': f'⚠️ {str(e)}'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': f'⚠️ Unexpected error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
