# Generated by Django 4.0.4 on 2024-05-12 19:20

import datetime
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_phone_user_staff_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='ward',
            name='created_date',
            field=models.DateField(auto_now_add=True, default=datetime.datetime.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='ward',
            name='status',
            field=models.CharField(choices=[('active', 'activae'), ('inactive', 'inactive')], default='active', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='staff_id',
            field=models.CharField(default=uuid.uuid4, max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='staff_role',
            field=models.CharField(choices=[('supervisor1', 'SUPERVISOR/DIRECTOR'), ('supervisor2', 'LGA SUPERVISOR/MONITOR'), ('ward_monitor', 'WARD SUPERVISOR/MONITOR'), ('tax_collector', 'TAX COLLECTOR')], max_length=20),
        ),
        migrations.CreateModel(
            name='TaxArea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tax_area_office', models.CharField(max_length=255)),
                ('tax_area_code', models.CharField(max_length=20, unique=True)),
                ('ward', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.ward')),
            ],
            options={
                'ordering': ['ward', 'tax_area_code'],
            },
        ),
    ]
