from django.shortcuts import get_object_or_404
from django.db.models import Count, F, Max
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Redditor, Trade
from .serializers import RedditorSerializer, TradeSerializer


def paginate(queryset, page, page_size):
    count = queryset.count()

    if page is not None and page.isdigit():
        page = int(page)

        if page_size is not None and page_size.isdigit():
            page_size = int(page_size)
        else:
            page_size = 20
        
        start = (page - 1) * page_size
        end = page * page_size
        if start < count:
            return queryset[start:end]

    return queryset


class RedditorViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]
    lookup_field = 'username'
    queryset = (Redditor.objects.all()
        .annotate(trades=Count('trades1'))
        .annotate(last_trade=Max('trades1__confirmation_datetime')))


    def list(self, request):
        qs = self.get_queryset()
        count = Redditor.objects.count()
        page = request.query_params.get('page', None)
        page_size = request.query_params.get('page_size', None)
        sort = request.query_params.get('sort', None)

        if sort is not None:
            if (sort == 'username' or sort == '-username' or
                sort == 'trades' or sort == '-trades' or
                sort == 'last_trade' or sort == '-last_trade'):
                qs = qs.order_by(sort)

        serializer = RedditorSerializer(paginate(qs, page, page_size), many=True)
        return Response({ 'count': count, 'redditors': serializer.data })

    
    def retrieve(self, request, username=None):
        redditor = get_object_or_404(Redditor, username=username)
        trades = redditor.trades1.annotate(username2=F('user2__username'))
        count = trades.count()
        sort = request.query_params.get('sort', None)
        page = request.query_params.get('page', None)
        page_size = request.query_params.get('page_size', None)

        if sort is not None:
            if (sort == 'username2' or sort == '-username2' or
                sort == 'confirmation_datetime' or sort == '-confirmation_datetime'):
                trades = trades.order_by(sort)

        serializer = TradeSerializer(paginate(trades, page, page_size), many=True)
        return Response({ 'count': count, 'trades': serializer.data })


class TradeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TradeSerializer
    queryset = Trade.objects.all()
