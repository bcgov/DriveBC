from apps.cms.tasks import populate_all_ferry_data
from apps.event.tasks import populate_all_event_data
from apps.rest.tasks import populate_all_rest_stop_data
from apps.weather.tasks import (
    populate_all_current_weather_data,
    populate_all_regional_weather_data,
)
from apps.webcam.tasks import (
    add_order_to_cameras,
    build_route_geometries,
    populate_all_webcam_data,
    update_all_webcam_data,
)
from django.core.management import call_command
from huey import crontab
from huey.contrib.djhuey import db_periodic_task


@db_periodic_task(crontab(hour="*/6", minute="0"))
def populate_webcam_task():
    populate_all_webcam_data()


@db_periodic_task(crontab(minute="*/1"))
def update_camera_task():
    update_all_webcam_data()


@db_periodic_task(crontab(minute="*/5"))
def populate_event_task():
    populate_all_event_data()


@db_periodic_task(crontab(hour="*/24", minute="0"))
def populate_ferry_task():
    populate_all_ferry_data()


@db_periodic_task(crontab(minute="*/1"))
def publish_scheduled():
    call_command('publish_scheduled')


@db_periodic_task(crontab(minute="*/20"))
def populate_regional_weather_task():
    populate_all_regional_weather_data()


@db_periodic_task(crontab(minute="*/20"))
def populate_current_weather_task():
    populate_all_current_weather_data()


@db_periodic_task(crontab(minute="*/5"))
def populate_rest_stop_task():
    populate_all_rest_stop_data()


@db_periodic_task(crontab(hour="*/24", minute="0", day_of_week="6"))
def build_reference_route_geometries():
    build_route_geometries()


@db_periodic_task(crontab(hour="*/24", minute="0", day_of_week="0"))
def add_camera_orders():
    add_order_to_cameras()
