'use strict';

angular.module('movieApp.controllers', ['angularUtils.directives.dirPagination'])
.controller('MovieListController', function($scope, popupService, $http, $window) {

    $scope.movies = [];

    $scope.order_by_options = [{
        type: 'Title A-Z',
        id: 'title'
    }, {
        type: 'Title Z-A',
        id: '-title'
    }, {
        type: 'Lowest Rating',
        id: 'rating'
    }, {
        type: 'Highest Rating',
        id: '-rating'
    }, {
        type: 'Oldest Release',
        id: 'release_year'
    }, {
        type: 'Newest Release',
        id: '-release_year'
    }];
    // Default order is by title
    $scope.selectedOrder = {
        id: 'title'
    };

    // Ajax request to fetch data into movies
    $http.get("/api/movies").then(
        function successCallback(response) {
            $scope.movies = response.data.results;
        });

    $scope.deleteMovie = function(movie) {
        if (popupService.showPopup('Really delete this?')) {
            $http.delete("/api/movies/" + movie.id)
                .then(function successCallback(response) {
                    $window.location.href = ''; //redirect to home
                });
        }
    };

}).controller('MovieViewController', function($scope, $stateParams, $http) {

    $http.get("/api/movies/" + $stateParams.id)
        .then(function successCallback(response) {
            $scope.movie = response.data;
        });

}).controller('MovieCreateController', function($scope, $state, $http) {

    $scope.movie = {};

    // Default values
    $scope.movie.release_year = 2016;
    $scope.movie.rating = 3;

    $scope.genres = [];
    $http.get("/api/movies-genres")
        .then(function successCallback(response) {
            $scope.genres = response.data.results;

            // Set the default genre as the first returned
            $scope.movie.genre = response.data.results[0].id;
        });

    $scope.addMovie = function() {

        var file = ($scope.movie.myFile === undefined ? '' : $scope.movie.myFile);
        var director = ($scope.movie.director === undefined ? '' : $scope.movie.director);
        var summary = ($scope.movie.summary === undefined ? '' : $scope.movie.summary);

        var uploadUrl = "/api/movies";

        var fd = new FormData();
        fd.append('image', file);
        fd.append('director', director);
        fd.append('release_year', $scope.movie.release_year);
        fd.append('title', $scope.movie.title);
        fd.append('summary', summary);
        fd.append('genre', $scope.movie.genre);
        fd.append('rating', $scope.movie.rating);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function successCallback(response) {
            $state.go('viewMovie', {
                id: response.data.id
            });
        });

    };

}).controller('MovieEditController', function($scope, $state, $stateParams, $http) {

    $scope.updateMovie = function() {

        var file = ($scope.movie.myFile === undefined ? '' : $scope.movie.myFile);
        var director = ($scope.movie.director === undefined ? '' : $scope.movie.director);
        var summary = ($scope.movie.summary === undefined ? '' : $scope.movie.summary);

        var uploadUrl = "/api/movies/" + $scope.movie.id;

        var fd = new FormData();
        fd.append('image', file);
        fd.append('director', director);
        fd.append('release_year', $scope.movie.release_year);
        fd.append('title', $scope.movie.title);
        fd.append('summary', summary);
        fd.append('genre', $scope.movie.genre);
        fd.append('rating', $scope.movie.rating);

        $http.put(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .then(function successCallback(response) {
                $state.go('viewMovie', {
                    id: $scope.movie.id
                });
            });

    };

    $scope.genres = [];
    $http.get("/api/movies-genres")
        .success(function(data) {
            $scope.genres = data.results;
        });

    $scope.loadMovie = function() {
        $http.get("/api/movies/" + $stateParams.id)
            .then(function successCallback(response) {
                $scope.movie = response.data;
            });
    };

    $scope.loadMovie();

}).controller('NavigationCtrl', function($scope, $location) {
    $scope.isCurrentPath = function(path) {
        // Not using $location.path().startsWith(path); as not supported in all browsers (phantomjs)
        // http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
        return ($location.path().substr(0, path.length) == path);
    };

}).controller('RatingController', function($scope) {
    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };
});
