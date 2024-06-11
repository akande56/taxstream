import uuid
from django.db import models
# from django.contrib.auth.models import AbstractUser
from taxapp2.users.models import User, TaxArea

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


types = (
        ('business', 'BUSINESS'),
        ('individual', 'INDIVIDUAL'),
        
    )

class BusinessUser(models.Model):
    """
    Model representing a business user (taxpayer).
    """
    user = models.OneToOneField(User, related_name='business_user', on_delete=models.SET_NULL, null=True)
    business_name = models.CharField(max_length=255)
    classification = models.ForeignKey(BusinessClassification, on_delete=models.CASCADE)
    withholding_tax_rate = models.ForeignKey(WithholdingTaxRate, on_delete=models.SET_NULL, null=True)
    business_status = models.ForeignKey(BusinessStatus, on_delete=models.CASCADE)
    tax_id = models.CharField(max_length=50, unique=True, default=uuid.uuid4)
    tax_area = models.ForeignKey(TaxArea, related_name='business_user_tax_area', on_delete=models.CASCADE, null=True)
    anual_income = models.FloatField()
    type = models.CharField(max_length=20, choices=types)
    

    class Meta:
        ordering = ['business_name']

    def __str__(self):
        return self.business_name



def all_required_fields_filled(assessment):
    # Get all model fields (excluding related fields)
    model_fields = assessment._meta.get_fields(include_parents=False)
    required_fields = [field for field in model_fields if not field.choices and field.blank is False]
    
    # Check if all required fields (except status) have values
    for field in required_fields:
        field_value = getattr(assessment, field.name)
        if field_value is None:
            return False
    return True


class Assessment(models.Model):
    user = models.OneToOneField(BusinessUser, related_name='tax_payer_assesment', on_delete=models.CASCADE)
    assessment_status = models.CharField(max_length=20,
    choices= (
        ('pending review', 'Pending Review'),
        ('reviewed', 'Reviewed'),
        ('query', 'Query'),
        ('approved', 'Approved'),
        ),
    default='pending review'
    )
    to_be_paid = models.FloatField(null=True, blank=True)
    tax_due_time = models.CharField(max_length=20,
    choices= (
        ('annually', 'Annually'),
        ('monthly', 'Monthly'),
        ('daily', 'Daily'),
    ),
    null= True,
    blank= True,
    )
    query = models.CharField(max_length=150)
    
    def approve_assessment(self):
        if all_required_fields_filled(self):  # Check if all required fields are filled
            self.assessment_status = 'approved'
            self.save()

    