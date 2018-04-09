from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import exceptions
from django.contrib.auth import authenticate, get_user_model, logout

from .serializers import MovieGenreSerializer, MovieSerializer, UserSerializer
from .models import Movie, MovieGenre


class MovieViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows movie to be viewed or edited.
    """
    queryset = Movie.objects.all().order_by('title')
    serializer_class = MovieSerializer


class MovieGenreViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows movie genres to be viewed or edited.
    """
    queryset = MovieGenre.objects.all().order_by('name')
    serializer_class = MovieGenreSerializer
