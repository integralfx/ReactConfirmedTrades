from rest_framework import serializers
from .models import Redditor, Trade


class RedditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Redditor
        fields = '__all__'


class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = '__all__'
