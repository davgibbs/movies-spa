from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

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


@api_view(['GET'])
@permission_classes((AllowAny, ))
def current_user(request):
    if request.user.id is None:
        return Response({'username': 'Anonymous User', 'id': None})
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
