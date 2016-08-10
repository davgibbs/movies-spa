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


describe('MovieListController Tests', function() {

    beforeEach(angular.mock.module('movieApp.controllers'));

    var scope, $httpBackend, controller;

    beforeEach(angular.mock.inject(function ($rootScope, _$httpBackend_, $controller) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        controller = $controller;
        $httpBackend
            .when('GET', '/api/movies')
            .respond(200, {'results': [{ 'title': 'superman', 'director': 'James Cameron'}, { 'title': 'batman', 'director': 'Bill Oddy'}]});
    }));

    it("get all is correct", function() {
        var state = {}
        var mypopupService, window;

        controller('MovieListController', {
            $scope: scope,
            $state: state,
            popupService: mypopupService,
            $window: window,
            $httpBackend: $httpBackend,
        });

    $httpBackend.flush();


    expect(scope.selectedOrder).toEqual({id: 'title'})
    expect(scope.order_by_options).toEqual( [{type: 'Title A-Z', id: 'title'}, {type: 'Title Z-A', id: '-title'}, {type: 'Lowest Rating', id: 'rating'}, {type: 'Highest Rating', id: '-rating'}, {type: 'Oldest Release', id:'release_year'}, {type: 'Newest Release', id: '-release_year'}])

    expect(scope.movies).toEqual([{ 'title': 'superman', 'director': 'James Cameron'}, { 'title': 'batman', 'director': 'Bill Oddy'}]);
  });

});
