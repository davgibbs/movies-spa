'use strict';

angular.module('movieApp.controllers', ['angularUtils.directives.dirPagination'])
    .controller('MovieListController', function($scope, popupService, $http, AuthService) {

        $scope.movies = [];
        $scope.loggedIn =  AuthService.isAuthenticated();
        console.log('start')
        $scope.$on('logout', function(){
            console.log('out there')
            $scope.loggedIn = AuthService.isAuthenticated();
        });

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
        $scope.loadMovies = function() {
            $http.get("/api/movies").then(
                function successCallback(response) {
                    $scope.movies = response.data;
                });
        };

        $scope.loadMovies();

        $scope.deleteMovie = function(movie) {
            if (popupService.showPopup('Really delete "' + movie.title + ' (' + movie.release_year + ')"?')) {
                $http.delete("/api/movies/" + movie.id)
                    .then(function successCallback(response) {
                        $scope.loadMovies();
                    }, function errorCallback(response){
                        popupService.showPopup('Not authorised to delete')
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
                $scope.genres = response.data;

                // Set the default genre as the first returned
                $scope.movie.genre = response.data[0].id;
            });

        $scope.addMovie = function() {

            var file = ($scope.movie.myFile === undefined ? '' : $scope.movie.myFile);
            var director = ($scope.movie.director === undefined ? '' : $scope.movie.director);
            var summary = ($scope.movie.summary === undefined ? '' : $scope.movie.summary);

            var fd = new FormData();
            fd.append('image', file);
            fd.append('director', director);
            fd.append('release_year', $scope.movie.release_year);
            fd.append('title', $scope.movie.title);
            fd.append('summary', summary);
            fd.append('genre', $scope.movie.genre);
            fd.append('rating', $scope.movie.rating);

            $http.post("/api/movies", fd, {
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

            var fd = new FormData();
            fd.append('image', file);
            fd.append('director', director);
            fd.append('release_year', $scope.movie.release_year);
            fd.append('title', $scope.movie.title);
            fd.append('summary', summary);
            fd.append('genre', $scope.movie.genre);
            fd.append('rating', $scope.movie.rating);

            $http.put("/api/movies/" + $scope.movie.id, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then(function successCallback(response) {
                    $state.go('viewMovie', {
                        id: $scope.movie.id
                    });
                }, function(response) {
                    alert('Issue: ' + response.data.detail);
                });

        };

        $scope.genres = [];
        $http.get("/api/movies-genres")
            .then(function successCallback(response) {
                $scope.genres = response.data;
            });

        $scope.loadMovie = function() {
            $http.get("/api/movies/" + $stateParams.id)
                .then(function successCallback(response) {
                    $scope.movie = response.data;
                });
        };

        $scope.loadMovie();

    }).controller('NavigationCtrl', function($scope, $rootScope, $location, $state, AuthService, AUTH_EVENTS) {

        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.$on(AUTH_EVENTS.loginSuccess, function(){
            $scope.loggedIn = AuthService.isAuthenticated();
        });
        $scope.$on('logout', function(){
            $scope.loggedIn = AuthService.isAuthenticated();
        });

        console.log(AuthService.isAuthenticated())
        $scope.isCurrentPath = function(path) {
            // Not using $location.path().startsWith(path); as not supported in all browsers (phantomjs)
            // http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
            return ($location.path().substr(0, path.length) == path);
        };

        $scope.logout = function ($event) {
            $event.preventDefault();
            AuthService.logout()
                .then(function successCallback (user) {
                    $rootScope.$broadcast('logout');
                    //$scope.setCurrentUser(user);
                    $state.go('movies', {});
                }, function errorCallback (message) {
                    $rootScope.$broadcast('fail');
                });
        };

    }).controller('RatingController', function($scope) {
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };
    }).controller('UserViewController', function($scope, AuthService, AUTH_EVENTS) {

        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.$on(AUTH_EVENTS.loginSuccess, function(){
            $scope.userName = AuthService.username();
        });
        $scope.$on('logout', function(){
            $scope.userName = AuthService.username();
        });

//        Session.subscribe($scope, function somethingChanged() {
//            // Handle notification
//            console.log(Session.username) //todo here!
//        });
//        $scope.setCurrentUser = function (user) {
//            $scope.currentUser = user;
//        };
//        $scope.$on('parent', function (event, data) {
//            console.log(data); // 'Some data'
//          });

//        setInterval(function(){
//            console.log('here') //todo here!
//            console.log(Session.username) //todo here!
//        }, 4000);
        
//        $http.get("/api/current-user")
//            .then(function successCallback(response) {
//                $scope.userName = response.data.username;
//            });

    }).controller('LoginController', function($scope, $rootScope, $state, AuthService, AUTH_EVENTS) {
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.loginError = '';

        $scope.login = function (credentials) {
            $scope.loginError = '';
            AuthService.login(credentials)
                .then(function successCallback (user) {

                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    //$scope.setCurrentUser(user);
                    $state.go('movies', {});
                }, function errorCallback (message) {
                    $scope.loginError = message.data.non_field_errors[0];
                    $rootScope.$broadcast('fail');
                });
        };

    });
