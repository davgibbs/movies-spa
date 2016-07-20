'use strict';

angular.module('movieApp.controllers',['angularUtils.directives.dirPagination']).controller('MovieListController',function($scope,$state,popupService,$window,Movie,$http){

    $scope.movies = [];

    $http.get("/api/movies")
            .success(function(data) {
                $scope.movies = data.results;
            }); // Ajax request to fetch data into movies

    $scope.deleteMovie=function(movie){
        if(popupService.showPopup('Really delete this?')){
            $http.delete("/api/movies/" + movie.id)
                .success(function(data){
                    $window.location.href='';
                });
        }
    };

}).controller('MovieViewController',function($scope,$stateParams,Movie){

    $scope.movie = Movie.get({id:$stateParams.id});

}).controller('MovieCreateController',function($scope,$state,$stateParams,Movie,$http){

    $scope.movie=new Movie();

    $scope.genres = [];
    $http.get("/api/movies-genres")
            .success(function(data) {
                $scope.genres = data.results;
            }); // The .success may be deprecated: https://docs.angularjs.org/api/ng/service/$http
                // Good example: http://techfunda.com/howto/565/http-post-server-request

    $scope.addMovie=function(){
            var file = $scope.movie.myFile;
            var uploadUrl = "/api/movies";

            var fd = new FormData();
            fd.append('image', file);
            fd.append('director', $scope.movie.director);
            fd.append('release_year', $scope.movie.release_year);
            fd.append('title', $scope.movie.title);
            fd.append('genre', $scope.movie.genre);

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
                $state.go('movies');
            })
            .error(function(){
                console.log('error');
            });
    };

}).controller('MovieEditController',function($scope,$state,$stateParams,Movie,$http){

    $scope.updateMovie=function(){
            var file;
            if ($scope.movie.myFile === undefined){
                file = '';
            }else{
                file = $scope.movie.myFile;
            } // todo use the short hand of else in javascript ?:...
            var uploadUrl = "/api/movies/" + $scope.movie.id;

            var fd = new FormData();
            fd.append('image', file);
            fd.append('director', $scope.movie.director);
            fd.append('release_year', $scope.movie.release_year);
            fd.append('title', $scope.movie.title);
            fd.append('genre', $scope.movie.genre);

            $http.put(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
                $state.go('movies');
            })
            .error(function(){
                console.log('error updating');
            });
    };

    $scope.genres = [];
    $http.get("/api/movies-genres")
            .success(function(data) {
                $scope.genres = data.results;
            });

    $scope.loadMovie=function(){
        $scope.movie=Movie.get({id:$stateParams.id});
    };

    $scope.loadMovie();

}).controller('NavigationCtrl', function ($scope, $location) {
    $scope.isCurrentPath = function (path) {
      // Not using $location.path().startsWith(path); as not supported in all browsers (phantomjs)
      // http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
      return ($location.path().substr(0, path.length) == path);
    };
  });
