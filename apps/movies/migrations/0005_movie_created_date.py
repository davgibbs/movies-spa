# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-09 14:58
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0004_auto_20160707_1605'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 7, 9, 14, 58, 6, 680366, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
