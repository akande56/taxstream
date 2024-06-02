# Generated by Django 4.0.4 on 2024-06-01 08:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taxpayer', '0002_businessuser_anual_income_businessuser_tax_area'),
    ]

    operations = [
        migrations.AddField(
            model_name='businessuser',
            name='type',
            field=models.CharField(choices=[('business', 'BUSINESS'), ('individual', 'INDIVIDUAL')], default='individual', max_length=20),
            preserve_default=False,
        ),
    ]