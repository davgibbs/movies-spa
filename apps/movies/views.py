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


@api_view(['GET'])
@permission_classes((AllowAny, ))
def current_user(request):
    if request.user.id is None:
        return Response({'username': 'Anonymous User', 'id': None, })
    print(request.user)
    print(get_user_model())
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes((AllowAny, ))
def login(request):
    username = request.data.get('username', None)
    password = request.data.get('password', None)

    if not username or not password:
        raise exceptions.AuthenticationFailed('No credentials provided.')

    credentials = {
        get_user_model().USERNAME_FIELD: username,
        'password': password
    }

    user = authenticate(**credentials)

    if user is None:
        raise exceptions.AuthenticationFailed('Invalid username/password.')

    if not user.is_active:
        raise exceptions.AuthenticationFailed('User inactive or deleted.')

    serializer = UserSerializer(user)
    return Response(serializer.data)


def logout(request):
    print('logout')
    print(request)
    logout(request)
    print('redirect')
    return HttpResponseRedirect('http://127.0.0.1:8000/')
