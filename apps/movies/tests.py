from collections import OrderedDict

from django.test import TestCase
from rest_framework.test import APIClient

from movies.models import Movie, MovieGenre


class MovieTestCase(TestCase):

    def test_list_movies(self):
        client = APIClient()
        response = client.get('/api/movies', {}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_list_movies_multiple(self):
        movie_genre = MovieGenre(name='Comedy')
        movie_genre.save()

        movie = Movie(title="Movie 1")
        movie.save()

        client = APIClient()
        response = client.get('/api/movies', {}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [OrderedDict([('id', 1),
                                                      ('title', 'Movie 1'),
                                                      ('summary', ''),
                                                      ('release_year', 2016),
                                                      ('director', ''),
                                                      ('genre', 1),
                                                      ('genre_obj', OrderedDict([('id', 1),
                                                                                 ('name', 'Comedy')])),
                                                      ('image', 'http://testserver/media/movies/Movie.jpg'),
                                                      ('rating', 3)])])


class MovieGenreTestCase(TestCase):

    def test_list_genres(self):
        movie_genre = MovieGenre(name='Comedy')
        movie_genre.save()

        client = APIClient()
        response = client.get('/api/movies-genres', {}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [OrderedDict([('id', 1), ('name', 'Comedy')])])
        movie_genre.delete()
