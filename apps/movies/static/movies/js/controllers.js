/**
 * Created by Sandeep on 01/06/14.
 */
angular.module('movieApp.controllers',[]).controller('MovieListController',function($scope,$state,popupService,$window,Movie,$http){

    $scope.movies = []

    $http.get("/api/movies")
            .success(function(data) {
                $scope.movies = data.results;
            });

    $scope.deleteMovie=function(movie){
        if(popupService.showPopup('Really delete this?')){
            $http.delete("/api/movies/" + movie.id)
                .success(function(data){
                    $window.location.href='';
                });
        }
    }

}).controller('MovieViewController',function($scope,$stateParams,Movie){

    $scope.movie=Movie.get({id:$stateParams.id});

}).controller('MovieCreateController',function($scope,$state,$stateParams,Movie,$http){

    $scope.movie=new Movie();

    $scope.genres = []
    $http.get("/api/movies-genres")
            .success(function(data) {
                $scope.genres = data.results;
            });

    $scope.addMovie=function(){
        $scope.movie.$save(function(){
            $state.go('movies');
        });
    }

}).controller('MovieEditController',function($scope,$state,$stateParams,Movie,$http){

    $scope.updateMovie=function(){
        $scope.movie.$update(function(){
            $state.go('movies');
        });
    };

    $scope.genres = []
    $http.get("/api/movies-genres")
            .success(function(data) {
                $scope.genres = data.results;
            });

    $scope.loadMovie=function(){
        $scope.movie=Movie.get({id:$stateParams.id});
    };

    $scope.loadMovie();

});
