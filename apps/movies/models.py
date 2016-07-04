from __future__ import unicode_literals

from django.db import models


class Movie(models.Model):
    """ Movie Information """
    MOVIE_GENRES = (
        ('action', 'Action'),
        ('adventure', 'Adventure'),
        ('comedy', 'Comedy'),
        ('crime_gangster', 'Crime & Gangster'),
        ('drama', 'Drama'),
        ('historical', 'Historical'),
        ('horror', 'Horror'),
        ('musicals', 'Musicals'),
        ('science_fiction', 'Science Fiction'),
        ('war', 'War'),
        ('westerns', 'Westerns'),
    )

    title = models.CharField(max_length=100, unique=True)
    release_year = models.IntegerField(max_length=4)
    director = models.CharField(max_length=100)
    genre = models.CharField(max_length=100, choices=MOVIE_GENRES)

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = 'Movie'
        verbose_name_plural = 'Movies'
