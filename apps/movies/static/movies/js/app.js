/**
 * Created by Sandeep on 01/06/14.
 */

var myapp = angular.module('movieApp',['ui.router','ngResource','movieApp.controllers','movieApp.services']);

myapp.config(function($stateProvider,$httpProvider,$interpolateProvider){
    $stateProvider.state('movies',{
        url:'/movies',
        templateUrl:'/static/movies/partials/movies.html',
        controller:'MovieListController'
    }).state('viewMovie',{
       url:'/movies/:id/view',
       templateUrl:'/static/movies/partials/movie-view.html',
       controller:'MovieViewController'
    }).state('newMovie',{
        url:'/movies/new',
        templateUrl:'/static/movies/partials/movie-add.html',
        controller:'MovieCreateController'
    }).state('editMovie',{
        url:'/movies/:id/edit',
        templateUrl:'/static/movies/partials/movie-edit.html',
        controller:'MovieEditController'
    });

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    //$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

}).run(function($state){
   $state.go('movies');
});


myapp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);