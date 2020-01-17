from django.shortcuts import get_object_or_404
from django.db.models import Count, F, Max
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Redditor, Trade
from .serializers import RedditorSerializer, TradeSerializer


class RedditorViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]
    lookup_field = 'username'
    queryset = (Redditor.objects.all()
        .annotate(trades=Count('trades1'))
        .annotate(last_trade=Max('trades1__confirmation_datetime')))
    serializer_class = RedditorSerializer


    def list(self, request):
        qs = self.queryset
        count = Redditor.objects.count()
        page = request.query_params.get('page', None)
        page_size = request.query_params.get('page_size', None)
        sort = request.query_params.get('sort', None)

        if sort is not None:
            if (sort == 'username' or sort == '-username' or
                sort == 'trades' or sort == '-trades' or
                sort == 'last_trade' or sort == '-last_trade'):
                qs = qs.order_by(sort)

        if page is not None and page.isdigit():
            page = int(page)

            if page_size is not None and page_size.isdigit():
                page_size = int(page_size)
            else:
                page_size = 20
            
            start = (page - 1) * page_size
            end = page * page_size
            if start < count:
                qs = qs[start:end]

        serializer = RedditorSerializer(qs, many=True)
        return Response({ 'count': count, 'redditors': serializer.data })


    @action(detail=True, methods=['get'])
    def trades(self, request, username):
        user = get_object_or_404(Redditor, username=username)
        serializer = TradeSerializer(user.trades1.order_by('user2__username'), many=True)
        return Response(serializer.data)


class TradeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TradeSerializer
    queryset = Trade.objects.all()
