# Generated by Django 3.2.13 on 2022-06-19 08:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='role',
        ),
        migrations.DeleteModel(
            name='Role',
        ),
    ]