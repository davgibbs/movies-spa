from django.shortcuts import render
from rest_framework import viewsets

from .serializers import MovieSerializer
from .models import Movie


def index(request):
    return render(request, "movies/index.html", {})


class MovieViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows movie to be viewed or edited.
    """
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
