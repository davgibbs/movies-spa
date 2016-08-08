"use strict";

(function() {

    var $controller, $location;

    module("NavigationCtrl Tests", {
        setup: function() {
            var injector = angular.injector([ 'ng', 'movieApp' ]);
            this.$scope = injector.get('$rootScope').$new();

            $controller = injector.get('$controller');
        }
    });


    test("NavigationCtrl", function() {
        var current_page;

        this.$location = {
            path: function() {return '/movies/1';}
        };
        $controller('NavigationCtrl', {
            $scope : this.$scope,
            $location: this.$location
        });

        current_page = this.$scope.isCurrentPath('/about');
        strictEqual(current_page, false, "check return false for about on movies");
        current_page = this.$scope.isCurrentPath('/movies');
        strictEqual(current_page, true, "check return true for movies on movies");

        this.$location = {
            path: function() {return '/about';}
        };
        $controller('NavigationCtrl', {
            $scope : this.$scope,
            $location: this.$location
        });

        current_page = this.$scope.isCurrentPath('/about');
        strictEqual(current_page, true, "check return true for about on about");
        current_page = this.$scope.isCurrentPath('/movies');
        strictEqual(current_page, false, "check return false for movies on about");
    });

// Need to investigate https://docs.angularjs.org/api/ngMock/service/$httpBackend
//    test("MovieViewController", function() {
//        this.$stateParams = {
//            id: 2
//        };
//        var Movie = { get: function() {return {movie_name: 'star trek'};} };

//        $controller('MovieViewController', {
//            $scope : this.$scope,
//            $stateParams: this.$stateParams,
//            Movie : Movie
//        });

//        Movie.get();

//        var expected = {"movie_name":"star trek"};

//        strictEqual(JSON.stringify(this.$scope.movie), JSON.stringify(expected), "check correct returned movie");

//    });


})();
