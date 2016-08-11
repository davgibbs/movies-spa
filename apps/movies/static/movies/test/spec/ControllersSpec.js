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
        var mypopupService, window;

        controller('MovieListController', {
            $scope: scope,
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


describe('RatingController Tests', function() {

    beforeEach(angular.mock.module('movieApp.controllers'));

    var scope, controller;

    beforeEach(angular.mock.inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller;
    }));

    it("get all is correct", function() {
        controller('RatingController', {
            $scope: scope
        });

    expect(scope.max).toEqual(5)
    expect(scope.isReadonly).toEqual(false);

  });

});


describe('MovieCreateController Tests', function() {

    beforeEach(angular.mock.module('movieApp.controllers'));

    var scope, state, $httpBackend, controller;

    beforeEach(angular.mock.inject(function ($rootScope, _$httpBackend_, $controller) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        controller = $controller;
        $httpBackend
            .when('POST', '/api/movies')
            .respond(200, 'success');

        $httpBackend
            .when('GET', '/api/movies-genres')
            .respond(200, {'results': [{'name': 'Action', 'id': '1'}]});
    }));

    it("create movie is correct", function() {
        controller('MovieCreateController', {
            $scope: scope,
            $state: state,
            $httpBackend: $httpBackend,
        });

    $httpBackend.flush();

    expect(scope.movie).toEqual({ release_year: 2016, rating: 3, genre: '1' });
    expect(scope.genres).toEqual([{'name': 'Action', 'id': '1'}]);
    $httpBackend.expectPOST('/api/movies');

  });

});
