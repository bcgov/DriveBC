# Generated by Django 4.2.1 on 2023-10-06 22:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webcam', '0004_webcam_test_alter_webcam_orientation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webcam',
            name='update_period_mean',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='webcam',
            name='update_period_stddev',
            field=models.PositiveIntegerField(),
        ),
    ]
