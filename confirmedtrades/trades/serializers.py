from rest_framework import serializers
from .models import Redditor, Trade


class RedditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Redditor
        fields = '__all__'


class TradeSerializer(serializers.ModelSerializer):
    username1 = serializers.ReadOnlyField(source='user1.username')
    username2 = serializers.ReadOnlyField(source='user2.username')

    class Meta:
        model = Trade
        fields = ('id', 'username1', 'username2', 'comment_id', 'comment_url', 'confirmation_datetime')
