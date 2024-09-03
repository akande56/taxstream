from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group

class Command(BaseCommand):
    help = "Creates user groups for supervisor roles"

    def handle(self, *args, **options):
        # print('user group creation mangement command called....')
        # supervisor1_group, created = Group.objects.get_or_create(name='supervisor1')
        # supervisor2_group, created = Group.objects.get_or_create(name='supervisor2')
        # ward_monitor_group, created = Group.objects.get_or_create(name='ward_monitor')
        # tax_collector_group, created = Group.objects.get_or_create(name='tax_collector')
        # assessment_officer_group, created = Group.objects.get_or_create(name = 'assessment_officer')
        # audit_officer_group, created = Group.objects.get_or_create(name = 'audit_officer')
        # tax_payer_group, created = Group.objects.get_or_create(name = 'tax_payer')
        self.stdout.write(self.style.SUCCESS('Successfully created user groups'))