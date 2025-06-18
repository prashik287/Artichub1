from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from twisted.names.client import query
import pprint
from Arts.models import ArtProduct
from rest_framework import serializers, status

from Arts.serializer import ArtSerializer


# Serializer for ArtProduct model
class ArtAuctions(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        queryset = ArtProduct.objects.filter(saleType="auction")
        pprint.pprint(queryset)
        serializer = ArtSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
