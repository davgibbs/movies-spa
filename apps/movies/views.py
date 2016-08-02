from django.shortcuts import render
from rest_framework import viewsets

from .serializers import MovieGenreSerializer, MovieSerializer
from .models import Movie, MovieGenre


def index(request):
    return render(request, "movies/index.html", {})


class MovieViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows movie to be viewed or edited.
    """
    queryset = Movie.objects.all().order_by('title')
    serializer_class = MovieSerializer


class MovieGenreViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows movie to be viewed or edited.
    """
    queryset = MovieGenre.objects.all().order_by('name')
    serializer_class = MovieGenreSerializer
