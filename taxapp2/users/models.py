import uuid
from django.db import models
# from django.conf import settings
# from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser, UserManager
# from django.db.models.signals import post_save
# from rest_framework.authtoken.models import Token

# class LGA(models.Model):
#     pass

class State(models.Model):
    name = models.CharField(max_length=50)

class LGA(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=20)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name


class CustomManager(UserManager):
    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('user_role', 'admin')
        return super().create_superuser(username, email, password, **extra_fields)


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    USER_ROLES = (
        ('supervisor1', 'SUPERVISOR/DIRECTOR'),
        ('supervisor2', 'LGA SUPERVISOR/MONITOR'),
        ('ward_monitor', 'WARD SUPERVISOR/MONITOR'),
        ('tax_collector', 'TAX COLLECTOR'),
        ('assessment_officer', 'ASSESSMENT OFFICER'),
        ('audit_officer', 'AUDIT OFFICER' ),
        ('tax_payer', 'TAX PAYER'),
        ('admin', 'Admin')
    )
    user_role = models.CharField(max_length=20, choices=USER_ROLES)
    # staff_id = models.CharField(max_length=50, unique=True, default=uuid.uuid4, null=True)
    phone = models.CharField(max_length=11)
    location = models.ForeignKey(LGA, on_delete=models.SET_NULL, null=True, blank= True, related_name='user_in_location')
    objects = CustomManager() #handles admin user 
    
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


class LGAsupervisor(models.Model):
    supervisor2 = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, related_name='lga_supervisor', validators=[validate_supervisor2_role])
    lga = models.ForeignKey(LGA, on_delete=models.CASCADE)

class Statesupervisor(models.Model):
    supervisor1 = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, related_name='state_supervisor', validators=[validate_supervisor1_role])
    lga = models.ForeignKey(LGA, on_delete=models.CASCADE)


class Ward(models.Model):
    area_name = models.CharField(max_length=50)
    area_code = models.CharField(max_length=20)
    lga = models.ForeignKey(LGA, on_delete=models.CASCADE, related_name='lgas_in_ward')
    created_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=
    (
        ("active", "active"),
        ("inactive", "inactive")
        )
    )

class TaxArea(models.Model):
    """
    Model representing a Tax Area within a jurisdiction.
    """
    ward = models.ForeignKey(Ward, on_delete=models.CASCADE, related_name='wards_in_taxArea')
    tax_area_office = models.CharField(max_length=255)
    tax_area_code = models.CharField(max_length=20, unique=True)
    # map_location = models.PointField(blank=True, null=True, srid=4326)  # Latitude & Longitude

    class Meta:
        ordering = ['ward', 'tax_area_code']

    def __str__(self):
        return f"{self.ward} - {self.tax_area_code}"


class WardAndMonitor(models.Model):
    ward = models.ForeignKey(Ward, primary_key=True ,on_delete=models.CASCADE)
    ward_monitor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank= True ,related_name='ward_monitor', validators=[validate_ward_monitor_role])


class BlacklistedToken(models.Model):
    token = models.CharField(max_length=255, unique=True)
    blacklisted_at = models.DateTimeField(auto_now_add=True)




# class BusinessClassification(models.Model):
#     """
#     Model representing a business classification.
#     """
#     name = models.CharField(max_length=255)
#     description = models.TextField(blank=True)

#     class Meta:
#         ordering = ['name']

#     def __str__(self):
#         return self.name

# class WithholdingTaxRate(models.Model):
#     """
#     Model representing a withholding tax rate.
#     """
#     rate = models.DecimalField(max_digits=5, decimal_places=2)

#     class Meta:
#         ordering = ['rate']

#     def __str__(self):
#         return f"{self.rate:.2%}"  # Display rate as a percentage

# class BusinessStatus(models.Model):
#     """
#     Model representing a business status.
#     """
#     status = models.CharField(max_length=50)

#     class Meta:
#         ordering = ['status']

#     def __str__(self):
#         return self.status

# class BusinessUser(models.Model):
#     """
#     Model representing a business user (taxpayer).
#     """
#     user = models.OneToOneField(User, on_delete=models.CASCADE)  # Link to User model
#     business_name = models.CharField(max_length=255)
#     classification = models.ForeignKey(BusinessClassification, on_delete=models.CASCADE)
#     withholding_tax_rate = models.ForeignKey(WithholdingTaxRate, on_delete=models.SET_NULL, null=True)
#     business_status = models.ForeignKey(BusinessStatus, on_delete=models.CASCADE)

#     class Meta:
#         ordering = ['business_name']

#     def __str__(self):
#         return self.business_name
