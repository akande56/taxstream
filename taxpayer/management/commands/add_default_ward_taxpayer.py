from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from taxpayer.models import BusinessUser
from taxapp2.users.models import Ward

class Command(BaseCommand):
    help = "Updates all existing BusinessUser instances to use the Ward with ID 1."

    def handle(self, *args, **options):
        try:
            ward = Ward.objects.get(pk=1)
        except Ward.DoesNotExist:
            raise CommandError("Ward with ID 1 does not exist.")

        with transaction.atomic():
            count_updated = BusinessUser.objects.filter(ward__isnull=True).update(ward=ward)
            self.stdout.write(self.style.SUCCESS(
                f"{count_updated} BusinessUser instances have been updated to use Ward ID 1."
            ))

