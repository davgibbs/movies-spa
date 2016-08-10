'use strict';


describe("Hello world", function() {
  it("says hello", function() {
    expect("Hello world!").toEqual("Hello world!");
  });
});


//.controller('MovieViewController', function($scope, $stateParams, $http) {

//    $http.get("/api/movies/" + $stateParams.id )
//        .then(function successCallback(response) {
//            $scope.movie = response.data;
//        });

//})


describe('MovieViewController Tests', function() {
    //var scope, $location, createController;

    beforeEach(module('movieApp'));
    beforeEach(module('movieApp.services'));
    beforeEach(module('movieApp.controllers'));

    //var scope, $location, createController;

    var $scope;
    beforeEach(inject(function ($rootScope) {
        $scope = $rootScope.$new();
    }));


  it("says hello", function() {
    expect("Hello dworld!").toEqual("Hello dworld!");
  });

});
