from rest_framework.routers import DefaultRouter

from . import views


router = DefaultRouter(trailing_slash=False)
router.register(r'movies', views.MovieViewSet)
router.register(r'movies-genres', views.MovieGenreViewSet)
