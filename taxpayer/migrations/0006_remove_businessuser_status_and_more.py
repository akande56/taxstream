# Generated by Django 4.0.4 on 2024-06-11 16:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taxpayer', '0005_businessuser_status_assessment'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='businessuser',
            name='status',
        ),
        migrations.AddField(
            model_name='assessment',
            name='assessment_status',
            field=models.CharField(choices=[('pending review', 'Pending Review'), ('reviewed', 'Reviewed'), ('query', 'Query'), ('approved', 'Approved')], default='pending review', max_length=20),
        ),
    ]
