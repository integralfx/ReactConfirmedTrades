from rest_framework import serializers
from .models import Redditor, Trade


class TradeSerializer(serializers.ModelSerializer):
    username1 = serializers.CharField(source='user1.username')
    username2 = serializers.CharField(source='user2.username')

    class Meta:
        model = Trade
        fields = '__all__'


class RedditorSerializer(serializers.ModelSerializer):
    trades1 = TradeSerializer(read_only=True, many=True)    # List of trades
    trades = serializers.IntegerField()                     # Number of trades

    class Meta:
        model = Redditor
        fields = ('id', 'username', 'trades1', 'trades')

