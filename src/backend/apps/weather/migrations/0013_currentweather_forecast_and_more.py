# Generated by Django 4.2.11 on 2024-06-05 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weather', '0012_remove_regionalweather_observation_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='currentweather',
            name='forecast',
            field=models.JSONField(null=True),
        ),
        migrations.AddField(
            model_name='currentweather',
            name='forecast_group',
            field=models.JSONField(null=True),
        ),
    ]
