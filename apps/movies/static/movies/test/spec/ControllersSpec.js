'use strict';


describe("Hello world", function() {
  it("says hello", function() {
    expect("Hello world!").toEqual("Hello world!");
  });
});


describe('MovieViewController Tests', function() {

    beforeEach(angular.mock.module('movieApp.controllers'));

    var scope, $httpBackend, controller;

    beforeEach(angular.mock.inject(function ($rootScope, _$httpBackend_, $controller) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        controller = $controller;
        $httpBackend
            .when('GET', '/api/movies/1')
            .respond(200, { 'title': 'superman', 'director': 'James Cameron'});
    }));

    it("get is correct", function() {
        var stateParams = {id: 1}

        controller('MovieViewController', {
            $scope: scope,
            $stateParams: stateParams,
            $httpBackend: $httpBackend,
        });

    $httpBackend.flush();

    expect(scope.movie).toEqual({ 'title': 'superman', 'director': 'James Cameron'});
  });

});
