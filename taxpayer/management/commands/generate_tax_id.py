import datetime as dt
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from taxpayer.models import BusinessUser


class Command(BaseCommand):
    help = "Updates all existing BusinessUser instances to use a new tax_id format (YYYYMMDDNNNN)."

    def handle(self, *args, **options):
        count_updated = 0  # Initialize counter for updated instances

        for business_user in BusinessUser.objects.all():
            today = dt.datetime.today().strftime("%Y%m%d")
            user_id = str(business_user.id)

            # Handle cases where user ID might be less than 4 digits
            if len(user_id) < 4:
                user_id = user_id.zfill(4)  # Pad with leading zeros
            else:
                user_id = user_id[-4:]  # Extract the last 4 digits

            business_user.tax_id = f"{today}{user_id}"
            business_user.save()
            count_updated += 1

        self.stdout.write(self.style.SUCCESS(
            f"{count_updated} BusinessUser instances have been updated with the new tax_id format."
        ))
