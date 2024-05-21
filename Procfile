release: python manage.py migrate
release: python3 manage.py create_user_group
web: gunicorn config.wsgi:application
