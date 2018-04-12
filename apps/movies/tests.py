from collections import OrderedDict

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from django.contrib.sessions.models import Session
from django.contrib.auth import SESSION_KEY

from movies.models import Movie, MovieGenre


def is_user_authenticated(session_key):
    try:
        session = Session.objects.get(session_key=session_key)
        session.get_decoded()[SESSION_KEY]
        return True
    except (Session.DoesNotExist, KeyError):
        return False


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

    def test_add_movie(self):
        user = User.objects.create_user('admin', 'myemail@test.com', 'password123')

        client = APIClient()  # This handles including the sessionid each time
        client.login(username='admin', password='password123')

        response = client.post('/api/movies', {'title': 'Lion King',
                                               'summary': 'Lion Movie',
                                               'release_year': '1994',
                                               'rating': 2,
                                               'director': 'Roger Allers'}, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Movie.objects.all()), 1)
        user.delete()

    def test_delete_movie(self):
        movie_genre = MovieGenre(name='Drama')
        movie_genre.save()

        movie = Movie(title="Movie 1")
        movie.save()

        user = User.objects.create_user('admin', 'myemail@test.com', 'password123')

        client = APIClient()
        client.login(username='admin', password='password123')
        response = client.delete('/api/movies/' + str(movie.id), format='json')

        self.assertEqual(response.status_code, 204)
        self.assertEqual(len(Movie.objects.all()), 0)
        user.delete()

    def test_delete_movie_not_logged_in(self):
        movie_genre = MovieGenre(name='Drama')
        movie_genre.save()

        movie = Movie(title="Movie 1")
        movie.save()

        client = APIClient()
        response = client.delete('/api/movies/' + str(movie.id), format='json')

        self.assertEqual(response.status_code, 403)
        self.assertEqual(len(Movie.objects.all()), 1)


class MovieGenreTestCase(TestCase):

    def test_list_genres(self):
        movie_genre = MovieGenre(name='Comedy')
        movie_genre.save()

        client = APIClient()
        response = client.get('/api/movies-genres', {}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [OrderedDict([('id', 1), ('name', 'Comedy')])])
        movie_genre.delete()


class UserLoginTestCase(TestCase):

    def test_user_login(self):
        user = User.objects.create_user('admin-test', 'myemail@test.com', 'password1234')
        self.assertEqual(len(Session.objects.all()), 0)

        client = APIClient()  # creates a session (non-authenicated)
        self.assertEqual(is_user_authenticated(client.session.session_key), False)

        # login user
        credentials = {'username': 'admin-test', 'password': 'password1234'}
        response = client.post('/rest-auth/login/', credentials, format='json')
        # just ignore token that is included in response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(is_user_authenticated(client.session.session_key), True)
        self.assertEqual(len(Session.objects.all()), 1)
        self.assertEqual(Session.objects.all()[0].get_decoded().get('_auth_user_id'), str(user.id))
        self.assertEqual(Session.objects.all()[0].get_decoded().get('_auth_user_id'), str(user.id))

    def test_user_login_bad_username(self):
        User.objects.create_user('admin-test', 'myemail@test.com', 'password1234')
        self.assertEqual(len(Session.objects.all()), 0)

        client = APIClient()
        self.assertEqual(is_user_authenticated(client.session.session_key), False)

        # login user
        credentials = {'username': 'admin-test', 'password': 'password1234s'}
        response = client.post('/rest-auth/login/', credentials, format='json')
        # just ignore token that is included in response
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'non_field_errors': ['Unable to log in with provided credentials.']})
        self.assertEqual(is_user_authenticated(client.session.session_key), False)
        self.assertEqual(len(Session.objects.all()), 1)
        self.assertEqual(Session.objects.all()[0].get_decoded().get('_auth_user_id'), None)

    def test_user_logout(self):
        user = User.objects.create_user('admin-test', 'myemail@test.com', 'password1234')
        self.assertEqual(len(Session.objects.all()), 0)

        client = APIClient()
        self.assertEqual(is_user_authenticated(client.session.session_key), False)

        # login user
        credentials = {'username': 'admin-test', 'password': 'password1234'}
        response = client.post('/rest-auth/login/', credentials, format='json')
        # just ignore token that is included in response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(is_user_authenticated(client.session.session_key), True)
        self.assertEqual(len(Session.objects.all()), 1)
        self.assertEqual(Session.objects.all()[0].get_decoded().get('_auth_user_id'), str(user.id))

        # Now logout
        response = client.post('/rest-auth/logout/', {}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'detail': 'Successfully logged out.'})

        self.assertEqual(len(Session.objects.all()), 0)
        self.assertEqual(is_user_authenticated(client.session.session_key), False)

    def test_get_session_loggedin_no(self):
        client = APIClient()
        response = client.get('/api/current-user/', {}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'loggedin': False})

    def test_get_session_loggedin_yes(self):
        User.objects.create_user('admin-test', 'myemail@test.com', 'password1234')
        client = APIClient()
        client.login(username='admin-test', password='password1234')
        response = client.get('/api/current-user/', {}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'loggedin': True, 'username': 'admin-test'})
