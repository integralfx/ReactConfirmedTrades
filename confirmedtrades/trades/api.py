from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Redditor, Trade
from .serializers import RedditorSerializer, TradeSerializer


class RedditorViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = RedditorSerializer
    queryset = Redditor.objects.all()
    lookup_field = 'username'

    @action(detail=True, methods=['get'])
    def trades(self, request, username):
        user = get_object_or_404(Redditor, username=username)
        serializer = TradeSerializer(user.trades1, many=True)
        return Response(serializer.data)


class TradeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TradeSerializer
    queryset = Trade.objects.all()
