from django.contrib import admin

from .models import MovieGenre, Movie

class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'director', 'release_year', 'genre', 'image', 'created_date')
    search_fields = ['title']
    list_display_links = ['title']

admin.site.register(MovieGenre)
admin.site.register(Movie, MovieAdmin)