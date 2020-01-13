from rest_framework import routers
from .api import RedditorViewSet, TradeViewSet

router = routers.DefaultRouter()
router.register('api/redditors', RedditorViewSet, 'redditors')
router.register('api/trades', TradeViewSet, 'trades')

urlpatterns = router.urls
