'use strict';

var movieapp = angular.module('movieApp', ['ui.router', 'ngResource', 'ngAnimate', 'ngCookies', 'ui.bootstrap', 'movieApp.controllers', 'movieApp.services', 'movieApp.directives']);

movieapp.config(function($stateProvider, $urlRouterProvider, $httpProvider, $interpolateProvider) {

        $stateProvider.
        state('movies', {
            url: '/movies',
            templateUrl: '/static/movies/partials/movies.html',
            controller: 'MovieListController'
        }).state('viewMovie', {
            url: '/movies/:id/view',
            templateUrl: '/static/movies/partials/movie-view.html',
            controller: 'MovieViewController'
        }).state('newMovie', {
            url: '/movies/new',
            templateUrl: '/static/movies/partials/movie-add.html',
            controller: 'MovieCreateController'
        }).state('editMovie', {
            url: '/movies/:id/edit',
            templateUrl: '/static/movies/partials/movie-edit.html',
            controller: 'MovieEditController'
        }).state('about', {
            url: '/about',
            templateUrl: '/static/movies/partials/about.html'
        }).state('login', {
            url: '/login',
            templateUrl: '/static/movies/partials/login.html',
            controller: 'LoginController'
        });

        // For any unmatched url, redirect to /movies
        $urlRouterProvider.otherwise('/movies');

        // django and angular both support csrf tokens. This tells angular which cookie to add to what header.
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    })
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });
