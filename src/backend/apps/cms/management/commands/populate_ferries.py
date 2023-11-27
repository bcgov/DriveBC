from apps.cms.tasks import populate_all_ferry_data
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **options):
        populate_all_ferry_data()
