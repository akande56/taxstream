# Generated by Django 4.0.4 on 2024-06-25 08:56

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('taxpayer', '0007_businessuser_ward'),
    ]

    operations = [
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('due_date', models.DateField()),
                ('invoice_number', models.CharField(max_length=50, unique=True)),
                ('status', models.CharField(choices=[('pending', 'Pending Payment'), ('paid', 'Paid'), ('overdue', 'Overdue')], default='pending', max_length=20)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('taxpayer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='taxpayer_invoices', to='taxpayer.businessuser')),
            ],
        ),
        migrations.AddField(
            model_name='assessment',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='assessment',
            name='next_due_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment_method', models.CharField(choices=[('card', 'card'), ('bank_transfer', 'bank-transfer')], max_length=50)),
                ('amount_paid', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('payment_date', models.DateField()),
                ('transaction_id', models.CharField(blank=True, max_length=100)),
                ('status', models.CharField(choices=[('pending', 'Pending Confirmation'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending', max_length=20)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('invoice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoice_payment_status', to='taxpayer.invoice')),
            ],
        ),
        migrations.AddField(
            model_name='assessment',
            name='current_invoice',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='taxpayer.invoice'),
        ),
    ]
