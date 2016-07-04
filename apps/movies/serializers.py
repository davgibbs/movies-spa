from rest_framework import serializers

from .models import Movie


class MovieSrializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id', 'title', 'release_year', 'director', 'genre')
