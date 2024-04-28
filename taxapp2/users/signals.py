from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


User = get_user_model()

def send_password_reset_email(sender, instance, reset_password_token, **kwargs):
    user = User.objects.get(pk=reset_password_token.user_pk)
    context = {
        'user': user,
        'reset_url' : f'https://https://taxstream-3bf552628416.herokuapp.com/api/password_reset/confirm/{instance.uidb64}/{instance.token}',
    }

    try:
        message = Mail(
            from_email='taxstream@startupjigawa.com.ng',
            to_emails=user.email,
            subject='Password Reset Request',
            template_id='your_sendgrid_template_id',  # Replace with your SendGrid template ID
            dynamic_template_data=context,
        )
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)

        if response.status_code == 202:
            print('*********************************')
            print('Password reset email sent successfully.')
        else:
            print('*********************************')
            print(f'Error sending password reset email: {response.body}')

    except Exception as e:
        print(f'An error occurred while sending the password reset email: {e}') 