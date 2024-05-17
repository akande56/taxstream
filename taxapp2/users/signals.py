import logging
import os
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django.db.models.signals import post_save
from django.contrib.auth.models import Group
from .models import User

from django_rest_passwordreset.signals import reset_password_token_created

logger = logging.getLogger(__name__)

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}?token={}".format(
            instance.request.build_absolute_uri(reverse('password_reset:reset-password-confirm')),
            reset_password_token.key)
    }

    # render email text
    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        # title:
        "Password Reset for {title}".format(title="StartUP Jigawa TaxStream"),
        # message:
        email_plaintext_message,
        # from:
        "taxstream@startupjigawa.com.ng",
        # to:
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
    logger.info('email....................................................................................')
    logger.info(context)
    instance.reset_password_token = reset_password_token


supervisor1_group = Group.objects.get_or_create(name='supervisor1')[0]
supervisor2_group = Group.objects.get_or_create(name='supervisor2')[0]
ward_monitor_group = Group.objects.get_or_create(name='ward_monitor')[0]
tax_collector_group = Group.objects.get_or_create(name='tax_collector')[0]
assessment_officer_group = Group.objects.get_or_create(name = 'assessment_officer'[0])
audit_officer_group = Group.objects.get_or_create(name= 'audit_officer')[0]

@receiver(post_save, sender=User)
def assign_user_to_group(sender, instance, created, **kwargs):
    if created:
        # New Users
        if instance.staff_role == 'supervisor1':
            supervisor1_group.user_set.add(instance)
        elif instance.staff_role == 'supervisor2':
            supervisor2_group.user_set.add(instance)
        elif instance.staff_role == 'ward_monitor':
            ward_monitor_group.user_set.add(instance)
        elif instance.staff_role == 'tax_collector':
            tax_collector_group.user_set.add(instance)
        elif instance.staff_role == 'assessment_officer':
            assessment_officer_group.user_set.add(instance)
        else:
            audit_officer_group.user_set.add(instance)
    else:
        # Updated users
        user_groups = instance.groups.all()  
        if instance.staff_role == 'supervisor1':
            # Add to supervisor1 if not already assigned
            if not supervisor1_group in user_groups:
                supervisor1_group.user_set.add(instance)
            # Remove from other groups
            for group in user_groups.exclude(name='supervisor1'):
                group.user_set.remove(instance)
        elif instance.staff_role == 'supervisor2':
            if not supervisor2_group in user_groups:
                supervisor2_group.user_set.add(instance)
            for group in user_groups.exclude(name='supervisor2'):
                group.user_set.remove(instance)
        elif instance.staff_role == 'ward_monitor':
            if not ward_monitor_group in user_groups:
                ward_monitor_group.user_set.add(instance)
            for group in user_groups.exclude(name='ward_monitor'):
                group.user_set.remove(instance)
        elif instance.staff_role == 'tax_collector':
            if not tax_collector_group in user_groups:
                tax_collector_group.user_set.add(instance)
            for group in user_groups.exclude(name='tax_collector'):
                group.user_set.remove(instance)
        elif instance.staff_role == 'assessment_officer':
            if not assessment_officer_group in user_groups:
                assessment_officer_group.user_set.add(instance)
            for group in user_groups.exclude(name='assessment_officer'):
                group.user_set.remove(instance)
        else:
            user_groups.clear()  # Remove all groups
            audit_officer_group.user_set.add(instance)