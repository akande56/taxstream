# Generated by Django 4.0.4 on 2024-05-18 15:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BusinessClassification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='BusinessStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(max_length=50)),
            ],
            options={
                'ordering': ['status'],
            },
        ),
        migrations.CreateModel(
            name='WithholdingTaxRate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment', models.CharField(help_text='tax name', max_length=50)),
                ('rate', models.DecimalField(decimal_places=2, help_text='decimal field', max_digits=5)),
            ],
            options={
                'ordering': ['rate'],
            },
        ),
        migrations.CreateModel(
            name='BusinessUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('business_name', models.CharField(max_length=255)),
                ('tax_id', models.CharField(default=uuid.uuid4, max_length=50, unique=True)),
                ('business_status', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taxpayer.businessstatus')),
                ('classification', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taxpayer.businessclassification')),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='business_user', to=settings.AUTH_USER_MODEL)),
                ('withholding_tax_rate', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='taxpayer.withholdingtaxrate')),
            ],
            options={
                'ordering': ['business_name'],
            },
        ),
    ]
