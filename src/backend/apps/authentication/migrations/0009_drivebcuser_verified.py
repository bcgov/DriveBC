# Generated by Django 4.2.16 on 2024-12-24 01:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0008_alter_savedroutes_criteria'),
    ]

    operations = [
        migrations.AddField(
            model_name='drivebcuser',
            name='verified',
            field=models.BooleanField(default=False),
        ),
    ]
