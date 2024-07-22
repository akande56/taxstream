import logging
from django.core.management.base import BaseCommand
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from taxpayer.models import Assessment, Invoice

logger = logging.getLogger('invoice_generator')

class Command(BaseCommand):
    help = 'Generate invoices for due assessments'

    def handle(self, *args, **options):
        logger.info("Starting invoice generation process")
        today = timezone.now().date()
        
        due_assessments = Assessment.objects.filter(
            assessment_status='approved',
            next_due_date__lte=today
        ).select_related('user')

        logger.info(f"Found {due_assessments.count()} due assessments")

        invoices_created = 0

        for assessment in due_assessments:
            try:
                Invoice.objects.create(
                    taxpayer=assessment.user,
                    amount=assessment.to_be_paid,
                    due_date=assessment.next_due_date,
                    status='pending'
                )
                invoices_created += 1
                logger.info(f"Created invoice for assessment ID: {assessment.id}, User: {assessment.user.email}")

                self.update_next_due_date(assessment)
                logger.info(f"Updated next due date for assessment ID: {assessment.id}")
            except Exception as e:
                logger.error(f"Error processing assessment ID: {assessment.id}. Error: {str(e)}")

        logger.info(f"Invoice generation complete. Created {invoices_created} invoices.")
        self.stdout.write(self.style.SUCCESS(f'Successfully created {invoices_created} invoices.'))

    def update_next_due_date(self, assessment):
        today = timezone.now().date()
        old_due_date = assessment.next_due_date
        
        if assessment.tax_due_time == 'daily':
            assessment.next_due_date = today + relativedelta(days=1)
        elif assessment.tax_due_time == 'monthly':
            assessment.next_due_date = today + relativedelta(months=1)
        elif assessment.tax_due_time == 'annually':
            assessment.next_due_date = today + relativedelta(years=1)
        else:
            logger.warning(f"Unknown tax_due_time '{assessment.tax_due_time}' for assessment ID: {assessment.id}")
            return  # Skip updating if tax_due_time is unknown
        
        assessment.save()
        logger.info(f"Updated due date for assessment ID: {assessment.id} from {old_due_date} to {assessment.next_due_date}")