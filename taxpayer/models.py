import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from taxapp2.users.models import User
class BusinessClassification(models.Model):
    """
    Model representing a business classification.
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class WithholdingTaxRate(models.Model):
    """
    Model representing a withholding tax rate.
    """
    payment = models.CharField(max_length=50, help_text='tax name')
    rate = models.DecimalField(max_digits=5, decimal_places=2, help_text='decimal field') 

    class Meta:
        ordering = ['rate']

    def __str__(self):
        return f"{self.rate:.2%}"  # Display rate as a percentage


class BusinessStatus(models.Model):
    """
    Model representing a business status.
    """
    status = models.CharField(max_length=50)

    class Meta:
        ordering = ['status']

    def __str__(self):
        return self.status


class BusinessUser(models.Model):
    """
    Model representing a business user (taxpayer).
    """
    user = models.OneToOneField(User, related_name='business user', on_delete=models.SET_NULL)
    business_name = models.CharField(max_length=255)
    classification = models.ForeignKey(BusinessClassification, on_delete=models.CASCADE)
    withholding_tax_rate = models.ForeignKey(WithholdingTaxRate, on_delete=models.SET_NULL, null=True)
    business_status = models.ForeignKey(BusinessStatus, on_delete=models.CASCADE)
    tax_id = models.CharField(max_length=50, unique=True, default=uuid.uuid4)

    class Meta:
        ordering = ['business_name']

    def __str__(self):
        return self.business_name