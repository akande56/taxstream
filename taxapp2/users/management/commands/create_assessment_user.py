from django.core.management.base import BaseCommand
from taxpayer.models import Assessment, BusinessUser

class Command(BaseCommand):
    help = 'Creates assessment instances for all users with user_role="tax_payer".'

    def handle(self, *args, **options):
        taxpayers = BusinessUser.objects.filter(user__user_role='tax_payer')  
        for taxpayer in taxpayers:
            if not Assessment.objects.filter(user=taxpayer).exists():
                assessment = Assessment.objects.create(user=taxpayer)
                assessment.save()
                self.stdout.write(self.style.SUCCESS(f'Created assessment for {taxpayer.user.username}'))
            else:
                self.stdout.write(self.style.WARNING(f'Assessment already exists for {taxpayer.user.username}'))
