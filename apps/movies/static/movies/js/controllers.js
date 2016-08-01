'use strict';

angular.module('movieApp.controllers',['angularUtils.directives.dirPagination']).controller('MovieListController',function($scope,$state,popupService,$window,Movie,$http){

    $scope.movies = [];

    $scope.order_by_options = ['title', 'year'];

 // Ajax request to fetch data into movies
    $http.get("/api/movies")  
                .then(function successCallback(response) {
                        $scope.movies = response.data.results;
                  }, function errorCallback(response) {
                    console.log(response.data);
                    console.log('error getting all');
                  });

    $scope.deleteMovie=function(movie){
        if(popupService.showPopup('Really delete this?')){
            $http.delete("/api/movies/" + movie.id)
                .then(function successCallback(response) {
                        $window.location.href='';
                  }, function errorCallback(response) {
                    console.log(response.data);
                    console.log('error deleting ');
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
        .then(function successCallback(response) {
                $scope.genres = response.data.results;
          }, function errorCallback(response) {
            console.log(response.data);
            console.log('error getting all');
          });

    $scope.addMovie=function(){
            var file = $scope.movie.myFile;
            var uploadUrl = "/api/movies";

            var fd = new FormData();
            fd.append('image', file);
            fd.append('director', $scope.movie.director);
            fd.append('release_year', $scope.movie.release_year);
            fd.append('title', $scope.movie.title);
            fd.append('genre', $scope.movie.genre);
            fd.append('rating', $scope.movie.rating);

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $state.go('viewMovie', {id: response.data.id});
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(response.data);
                console.log('error adding ' + response.data);
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
            fd.append('rating', $scope.movie.rating);

            $http.put(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $state.go('viewMovie', {id: $scope.movie.id});
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(response.data);
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

}).controller('RatingDemoCtrl', function ($scope) {
  $scope.movie.rating = 3;
  $scope.max = 5;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };
})
;
