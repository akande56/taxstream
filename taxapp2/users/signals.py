import logging
import os
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django.db.models.signals import post_save
from django.contrib.auth.models import Group
from django.utils.http import urlsafe_base64_encode
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
    if hasattr(instance, 'response'):
        response = instance.response  # Assuming response is set in the view

        # Construct the reset password URL
        reset_password_url = reverse('password_reset:reset-password-confirm', kwargs={
            'uidb64': urlsafe_base64_encode(user.pk).decode(),
            'token': reset_password_token.key
        })

        # Update the response to include the reset_password_url
        response.data.update({'reset_password_url': reset_password_url})

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
    


supervisor1_group = Group.objects.get_or_create(name='supervisor1')[0]
supervisor2_group = Group.objects.get_or_create(name='supervisor2')[0]
ward_monitor_group = Group.objects.get_or_create(name='ward_monitor')[0]
tax_collector_group = Group.objects.get_or_create(name='tax_collector')[0]


@receiver(post_save, sender=User)
def assign_user_to_group(sender, instance, created, **kwargs):
    if created:
        # Logic to determine the appropriate group(s) based on user attributes or other factors
        if instance.staff_role == 'supervisor1':
            supervisor1_group.user_set.add(instance)
        elif instance.staff_role == 'supervisor2':
            supervisor2_group.user_set.add(instance)
        elif instance.staff_role == 'ward_monitor':
            ward_monitor_group.user_set.add(instance)
        else:
            tax_collector_group.user_set.add(instance)

