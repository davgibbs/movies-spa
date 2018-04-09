from collections import OrderedDict

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
#from rest_framework.authtoken.models import Token, Session
from django.contrib.sessions.models import Session

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

    def test_add_movie(self):
        user = User.objects.create_user('admin', 'myemail@test.com', 'password123')
        #Token.objects.create(user=user)
        #mytoken = Token.objects.get(user=user).key
        print('Here')
        print(dir(Session.objects))
        print('End')
        mysession = Session.objects.get(user=user).key

        client = APIClient()

        #header = {'HTTP_AUTHORIZATION': 'Token {0}'.format(mytoken)}
        header = {'sessionid': '{0}'.format(mysession)}
        response = client.post('/api/movies', {'title': 'Lion King',
                                               'summary': 'Lion Movie',
                                               'release_year': '1994',
                                               'rating': 2,
                                               'director': 'Roger Allers'}, format='json', **header)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Movie.objects.all()), 1)
        user.delete()

    def test_delete_movie(self):
        movie_genre = MovieGenre(name='Drama')
        movie_genre.save()

        movie = Movie(title="Movie 1")
        movie.save()

        user = User.objects.create_user('admin', 'myemail@test.com', 'password123')
        #Token.objects.create(user=user)
        #mytoken = Token.objects.get(user=user).key

        client = APIClient()

        #header = {'HTTP_AUTHORIZATION': 'Token {0}'.format(mytoken)}
        header = {}
        response = client.delete('/api/movies/' + str(movie.id), format='json', **header)

        self.assertEqual(response.status_code, 204)
        self.assertEqual(len(Movie.objects.all()), 0)
        user.delete()

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
        user = User.objects.create_user('admin', 'myemail@test.com', 'password123')

        client = APIClient()
        credentials = {'username': 'admin', 'password': 'password123'}
        # Create and return the auth token for the user
        response = client.post('/rest-auth/login/', credentials, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'key': user.auth_token.key})
        user.delete()

    def test_user_logout(self):
        client = APIClient()
        #print(client)
        #print(self.client)
        print('dfdfd')
        print(dir(client.session.session_key))
        print(client.session.session_key)
        session = Session.objects.get(session_key=client.session.session_key)
        print(dir(Session.objects.get(session_key=client.session.session_key)))
        uid = session.get_decoded().get('_auth_user_id')
        print(uid)
        user = User.objects.get(pk=uid)
        print(user)

        print('dfdfd2')
        user = User.objects.create_user('admin', 'myemail@test.com', 'password123')
        self.assertEqual(hasattr(user, 'auth_token'), False)
        #print(dir(client.session))
        self.assertEqual(user.is_authenticated(), False)

        credentials = {'username': 'admin', 'password': 'password123'}
        # Create and return the auth token for the user
        response = client.post('/rest-auth/login/', credentials, format='json')
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(username='admin')
        self.assertEqual(response.data, {'key': user.auth_token.key})
        self.assertEqual(user.is_authenticated(), True)

        # Now logout
        user = User.objects.get(username='admin')
        self.assertEqual(hasattr(user, 'auth_token'), True)
        mytoken = Token.objects.get(user=user).key
        #header = {'HTTP_AUTHORIZATION': 'Token {0}'.format(mytoken)}
        self.client.session['_auth_user_id']

        response = client.post('/rest-auth/logout/', {}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'detail': 'Successfully logged out.'})
        user = User.objects.get(username='admin')
        self.assertEqual(hasattr(user, 'auth_token'), False)
        self.assertEqual(user.is_authenticated(), False)

