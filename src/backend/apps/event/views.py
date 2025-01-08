from apps.event.enums import EVENT_STATUS
from apps.event.models import Event
from apps.event.serializers import EventPollingSerializer, EventSerializer
from apps.shared.enums import CacheKey, CacheTimeout
from apps.shared.views import CachedListModelMixin
from rest_framework import viewsets


class EventAPI(CachedListModelMixin):
    queryset = Event.objects.all().exclude(status=EVENT_STATUS.INACTIVE)
    serializer_class = EventSerializer
    cache_key = CacheKey.EVENT_LIST
    cache_timeout = CacheTimeout.EVENT_LIST


class EventPollingAPI(EventAPI):
    serializer_class = EventPollingSerializer
    cache_key = CacheKey.EVENT_LIST_POLLING


class EventViewSet(EventAPI, viewsets.ReadOnlyModelViewSet):
    pass


class EventPollingViewSet(EventPollingAPI, viewsets.ReadOnlyModelViewSet):
    pass


class EventTestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventAPI.queryset
    serializer_class = EventAPI.serializer_class
