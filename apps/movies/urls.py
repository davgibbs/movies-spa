from rest_framework.routers import DefaultRouter
from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views


router = DefaultRouter(trailing_slash=False)
router.register(r'movies', views.MovieViewSet)
router.register(r'movies-genres', views.MovieGenreViewSet)
urlpatterns = router.urls

