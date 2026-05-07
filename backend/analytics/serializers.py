from rest_framework import serializers
from .models import CognitiveTrend, DailyWellness

class CognitiveTrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = CognitiveTrend
        fields = '__all__'

class DailyWellnessSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyWellness
        fields = '__all__'
