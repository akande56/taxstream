import uuid
from django.db import models
# from django.conf import settings
# from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser
# from django.db.models.signals import post_save
# from rest_framework.authtoken.models import Token


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    STAFF_ROLES = (
        ('supervisor1', 'SUPERVISOR/DIRECTOR'),
        ('supervisor2', 'LGA SUPERVISOR/MONITOR'),
        ('ward_monitor', 'WARD SUPERVISOR/MONITOR'),
        ('tax_collector', 'TAX COLLECTOR'),
    )
    staff_role = models.CharField(max_length=20, choices=STAFF_ROLES)
    staff_id = models.CharField(max_length=50, unique=True, default=uuid.uuid4)
    phone = models.CharField(max_length=11)
    def __str__(self):
        return self.username

def validate_supervisor1_role(value):
    if value is not None and not value.groups.filter(name='supervisor1').exists():
        raise ValidationError('User must be a supervisor1 to be assigned as state supervisor.')

def validate_supervisor2_role(value):
    if value is not None and not value.groups.filter(name='supervisor2').exists():
        raise ValidationError('User must be a supervisor1 to be assigned as LGA supervisor.')

def validate_ward_monitor_role(value):
    if value is not None and not value.groups.filter(name='ward_monitor').exists():
        raise ValidationError('User must be a ward_monitor to be assigned as ward monitor.')


class State(models.Model):
    name = models.CharField(max_length=50)
    supervisor1 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='state_supervisor1', validators=[validate_supervisor1_role])


class LGA(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=2)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    supervisor2 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='lga_supervisor2', validators=[validate_supervisor2_role])


class Ward(models.Model):
    area_name = models.CharField(max_length=50)
    area_code = models.CharField(max_length=2)
    lga = models.ForeignKey(LGA, on_delete=models.CASCADE)
    created_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=
    (
        ("active", "activae"),
        ("inactive", "inactive")
        )
    )

class TaxArea(models.Model):
    """
    Model representing a Tax Area within a jurisdiction.
    """
    ward = models.ForeignKey(Ward, on_delete=models.CASCADE)
    tax_area_office = models.CharField(max_length=255)
    tax_area_code = models.CharField(max_length=20, unique=True)
    # map_location = models.PointField(blank=True, null=True, srid=4326)  # Latitude & Longitude

    class Meta:
        ordering = ['ward', 'tax_area_code']

    def __str__(self):
        return f"{self.ward} - {self.tax_area_code}"


class WardAndMonitor(models.Model):
    ward = models.OneToOneField(Ward, on_delete=models.CASCADE, primary_key=True)
    ward_monitor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='ward_monitor', validators=[validate_ward_monitor_role])


class BlacklistedToken(models.Model):
    token = models.CharField(max_length=255, unique=True)
    blacklisted_at = models.DateTimeField(auto_now_add=True)