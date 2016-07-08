from __future__ import unicode_literals

from django.db import models


class MovieGenre(models.Model):
    """ Movie Genre """
    name = models.CharField(max_length=100, unique=True)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = 'Movie Genre'
        verbose_name_plural = 'Movie Genres'


class Movie(models.Model):
    """ Movie Information """
    title = models.CharField(max_length=100, unique=True)
    release_year = models.PositiveIntegerField()
    director = models.CharField(max_length=100)
    genre = models.ForeignKey(MovieGenre, verbose_name='Movie Genre', related_name='movie_genre')
    image = models.ImageField(upload_to='movies/', default='movies/Movie.jpg')

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = 'Movie'
        verbose_name_plural = 'Movies'
