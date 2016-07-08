/**
 * Created by Sandeep on 01/06/14.
 */
angular.module('movieApp.controllers',[]).controller('MovieListController',function($scope,$state,popupService,$window,Movie,$http){

    $scope.movies = [];

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
    };

}).controller('MovieViewController',function($scope,$stateParams,Movie){

    $scope.movie=Movie.get({id:$stateParams.id});

}).controller('MovieCreateController',function($scope,$state,$stateParams,Movie,$http){

    $scope.movie=new Movie();

    $scope.genres = [];
    $http.get("/api/movies-genres")
            .success(function(data) {
                $scope.genres = data.results;
            });

    $scope.setFile = function(element) {
          $scope.currentFile = element.files[0];
          var reader = new FileReader();

          reader.onload = function(event) {
            $scope.image_source = event.target.result;

            $scope.$apply();
          }
          // when the file is read it triggers the onload event above.
          reader.readAsDataURL(element.files[0]);
        }

    $scope.addMovie=function(){
//            console.log('add here');
        $scope.movie.$save(function(data){
//            console.log('here');
//            if (data.error_message){
//                popupService.showPopup('Error here: ' + data.error_message);
//            }
//            else {
                $state.go('movies');
//            }
        });
    };

}).controller('MovieEditController',function($scope,$state,$stateParams,Movie,$http){

    $scope.updateMovie=function(){
        $scope.movie.$update(function(data){
            if (data.error_message){
                popupService.showPopup('Error here: ' + data.error_message);
            }
            else {
                $state.go('movies');
            }
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

});
