import uuid
from datetime import date, timedelta
from django.db import models
from django.core.validators import MinValueValidator
# from django.contrib.auth.models import AbstractUser
from taxapp2.users.models import User, TaxArea, Ward

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
    business_status = models.ForeignKey(BusinessStatus, on_delete=models.CASCADE, default=1)
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, null=True,related_name='taxpayer_ward', default=1)
    tax_id = models.CharField(max_length=50, unique=True, default=uuid.uuid4)
    tax_area = models.ForeignKey(TaxArea, related_name='business_user_tax_area', on_delete=models.CASCADE, null=True)
    anual_income = models.FloatField()
    type = models.CharField(max_length=20, choices=types)
    

    class Meta:
        ordering = ['business_name']

    def __str__(self):
        return self.business_name




class Invoice(models.Model):
    taxpayer = models.ForeignKey('BusinessUser', on_delete=models.CASCADE, related_name='taxpayer_invoices')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    due_date = models.DateField()
    invoice_number = models.CharField(max_length=50, unique=True, default=uuid.uuid4)  # Unique invoice number
    status = models.CharField(max_length=20, choices=(
        ('pending', 'Pending Payment'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    ), default='pending')
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invoice #{self.invoice_number} for {self.taxpayer.user.email}"



class Payment(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='invoice_payment_receipt')
    payment_method = models.CharField(max_length=50, null=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], null=True, blank=True)
    payment_date = models.DateField(blank=True, null=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=(
        ('pending', 'Pending Confirmation'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ), default='pending')
    created_date = models.DateTimeField(auto_now_add=True)

    # A dditional fields from Flutterwave webhook response
    charged_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], null=True, blank=True)
    app_fee = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], null=True, blank=True)
    merchant_fee = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], null=True, blank=True)
    processor_response = models.TextField(blank=True, null=True)
    auth_model = models.CharField(max_length=50, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    customer_name = models.CharField(max_length=255, blank=True, null=True)
    customer_email = models.EmailField(blank=True, null=True)

    # Card details (optional)
    card_first_six_digits = models.CharField(max_length=10, blank=True, null=True)
    card_last_four_digits = models.CharField(max_length=4, blank=True, null=True)
    card_issuer = models.CharField(max_length=255, blank=True, null=True)
    card_country = models.CharField(max_length=2, blank=True, null=True)
    card_type = models.CharField(max_length=50, blank=True, null=True)
    card_expiry = models.CharField(max_length=5, blank=True, null=True)

    def __str__(self):
        return f"Payment for invoice #{self.invoice.invoice_number}"



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
    next_due_date = models.DateField(blank=True, null=True)
    # current_invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True, blank=True)
    query = models.CharField(max_length=150)
    created_date = models.DateTimeField(auto_now_add=True)
    
    def clean(self):
        # Implement custom validation rules here (e.g., check for valid tax amount)
        errors = super().clean()  # Call parent clean() for built-in validation
        return errors

    # def approve_assessment(self):
    
    #     if not self.assessment_status=='approved':  # Check validation and approval status

    #         self.assessment_status = 'approved'
    #         print('approved....')
            

    #         # Calculate due date based on tax_due_time
    #         if self.tax_due_time == 'annually':
    #             self.next_due_date = self.created_date + timedelta(days=365)  # Adjust for leap years if needed
    #         elif self.tax_due_time == 'monthly':
    #             self.next_due_date = self.created_date + timedelta(days=30)
    #         else:
    #             self.next_due_date = self.created_date + timedelta(days=1)
            
    #         self.save()
    #         print('assessment:::')
    #         print(self)
            
    #         invoice = Invoice.objects.get_or_create(
    #             taxpayer=self.user,
    #             assessment=self,
    #             amount=self.to_be_paid,  # Replace with your calculation function
    #             due_date=self.next_due_date
    #         )
    #         invoice.save()
    #         print("invoice for taxpayer created, id:")
    #         print(invoice.id)
            # Additional logic (e.g., sending invoice notification)

    # def get_current_invoice(self):
    #     return self.current_invoice