# Generated by Django 4.0.4 on 2024-05-14 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_ward_created_date_ward_status_alter_user_staff_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lga',
            name='code',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='ward',
            name='area_code',
            field=models.CharField(max_length=20),
        ),
    ]
