# Generated by Django 4.2.7 on 2023-11-04 07:35

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='due_date',
            field=models.DateTimeField(blank=True, default=datetime.date(2023, 11, 4), null=True),
        ),
    ]
