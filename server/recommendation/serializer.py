# ml_model/serializers.py
from rest_framework import serializers

class PredictionInputSerializer(serializers.Serializer):
    input_field = serializers.FloatField()  # Adjust data type as per your input
