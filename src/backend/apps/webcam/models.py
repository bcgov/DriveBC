from apps.shared.models import BaseModel
from django.contrib.gis.db import models


class Webcam(BaseModel):
    # Description
    name = models.CharField(max_length=128)
    caption = models.CharField(max_length=256)

    # Location
    region = models.PositiveSmallIntegerField()
    region_name = models.CharField(max_length=128)
    highway = models.CharField(max_length=32)
    highway_description = models.CharField(max_length=128, blank=True)
    highway_group = models.PositiveSmallIntegerField()
    highway_cam_order = models.PositiveSmallIntegerField()
    location = models.PointField()
    orientation = models.CharField(max_length=32, blank=True)
    elevation = models.PositiveSmallIntegerField()

    # General status
    is_on = models.BooleanField(default=True)
    should_appear = models.BooleanField(default=True)
    is_new = models.BooleanField(default=False)
    is_on_demand = models.BooleanField(default=False)

    # Update status
    marked_stale = models.BooleanField(default=False)
    marked_delayed = models.BooleanField(default=False)
    last_update_attempt = models.DateTimeField(null=True)
    last_update_modified = models.DateTimeField(null=True)
    update_period_mean = models.PositiveSmallIntegerField()
    update_period_stddev = models.PositiveSmallIntegerField()

    # Within two standard deviations from mean
    @property
    def minimum_update_window(self):
        if not self.update_period_mean or not self.update_period_stddev:
            return 0  # Always update

        return self.update_period_mean - (2 * self.update_period_stddev)

    def should_update(self, time):
        if not self.last_update_modified:
            return True

        time_delta = time - self.last_update_modified
        return time_delta.seconds >= self.minimum_update_window
