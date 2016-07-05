from rest_framework import serializers

from .models import MovieGenre, Movie


class MovieGenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieGenre
        fields = ('id', 'name')


class MovieSerializer(serializers.ModelSerializer):
    genre_obj = MovieGenreSerializer(source='genre', read_only=True)

    class Meta:
        model = Movie
        fields = ('id', 'title', 'release_year', 'director', 'genre_obj')

