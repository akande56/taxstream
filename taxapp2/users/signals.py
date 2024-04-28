# import logging
# import os
# from django.contrib.auth import get_user_model
# from django.core.mail import send_mail
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail
# logger = logging.getLogger(__name__)

# User = get_user_model()

# def send_password_reset_email(sender, instance, reset_password_token, **kwargs):
#     user = User.objects.get(pk=reset_password_token.user_pk)
#     context = {
#         'user': user,
#         'reset_url' : f'https://https://taxstream-3bf552628416.herokuapp.com/api/password_reset/confirm/{instance.uidb64}/{instance.token}',
#     }

#     try:
#         message = Mail(
#             from_email='taxstream@startupjigawa.com.ng',
#             to_emails=user.email,
#             subject='Password Reset Request',
#             template_id='your_sendgrid_template_id',  # Replace with your SendGrid template ID
#             dynamic_template_data=context,
#         )
#         sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
#         response = sg.send(message)

#         if response.status_code == 200:
#             print('*********************************')
#             logger.info("Password reset email sent successfully to %s", user.email) 
#         else:
#             print('*********************************')
#             logger.error(f"Error sending password reset email to {user.email}: {response.body}")

#     except Exception as e:
#         logger.error(f"An error occurred while sending the password reset email: {e}") 
import logging
import os
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created

logger = logging.getLogger(__name__)

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    logger.info('signal initiated..................&&&....')
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
    response = msg.send()
    if response.status_code == 200:
        logger.info("Password reset email sent successfully %s") 
    else:
        logger.error(f"Error sending password reset email : {response.body}")