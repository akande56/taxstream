import logging
import os
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django.db.models.signals import post_save
from django.contrib.auth.models import Group
from django.utils.http import urlsafe_base64_encode
from django.dispatch import Signal
from .models import User

from django_rest_passwordreset.signals import reset_password_token_created

logger = logging.getLogger(__name__)


# Custom signal for successful password reset request
password_reset_request_success = Signal()


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
    user = reset_password_token.user
    email = user.email
    # Construct the reset password URL
    reset_password_url = reverse('password_reset:reset-password-confirm', kwargs={
        'uidb64': urlsafe_base64_encode(user.pk).decode(),
        'token': reset_password_token.key
    })

    # Emit custom signal with user, email, and reset URL
    password_reset_request_success.send(sender=sender, user=user, email=email, reset_password_url=reset_password_url)
    

def handle_password_reset_request_success(sender, user, email, reset_password_url, **kwargs):
    """
    Handles successful password reset request and includes URL in a separate response.

    This function is triggered by the custom signal `password_reset_request_success`.
    It constructs a separate response object with the reset URL.

    :param sender: The object that sent the signal
    :param user: The user object associated with the reset request
    :param email: The user's email address
    :param reset_password_url: The constructed reset password URL
    :param kwargs: Additional arguments
    """

    # Create a separate response object (modify according to your needs)
    response = {'message': 'Password reset email sent successfully',
                'reset_password_url': reset_password_url}
    return response

# Connect the handler function to the signal
password_reset_request_success.connect(handle_password_reset_request_success)


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

