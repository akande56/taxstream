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

class WardAndMonitor(models.Model):
    ward = models.OneToOneField(Ward, on_delete=models.CASCADE, primary_key=True)
    ward_monitor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='ward_monitor', validators=[validate_ward_monitor_role])


class BlacklistedToken(models.Model):
    token = models.CharField(max_length=255, unique=True)
    blacklisted_at = models.DateTimeField(auto_now_add=True)