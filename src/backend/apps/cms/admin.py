from apps.cms.models import FAQ, Bulletin, Advisory
from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin


class FAQAdmin(OSMGeoAdmin):
    list_display = [
        'id', 'name', 'body',
        'order', 'active', 'email',
        'url', 'location_geometry',
        'created_at', 'modified_at'
    ]


class BulletinAdmin(OSMGeoAdmin):
    list_display = [
        'id', 'created_at', 'modified_at',
        'bulletin_title', 'bulletin_body',
        'bulletin_teaser',
    ]

    # list_display = [
    #     'id', 'name', 'body',
    #     'order', 'active', 'email',
    #     'url', 'created_at', 'modified_at'
    # ]


class AdvisoryAdmin(OSMGeoAdmin):
    # model = Advisory
    # list_display = ("advisory_title", "advisory_body", 'location_geometry')
    list_display = [
        'id', 'location_geometry',
        'created_at', 'modified_at',
        'advisory_title', 'advisory_body',
        'advisory_teaser',
    ]


admin.site.register(FAQ, FAQAdmin)
admin.site.register(Bulletin, BulletinAdmin)
admin.site.register(Advisory, AdvisoryAdmin)




