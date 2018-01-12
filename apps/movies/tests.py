from django.test import TestCase
from rest_framework.test import APIClient


class MovieTestCase(TestCase):

    def test_list_movies(self):
        client = APIClient()
        response = client.get('/api/movies', {}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])
