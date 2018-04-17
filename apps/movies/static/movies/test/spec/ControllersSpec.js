'use strict';


describe("Hello world", function() {
  it("says hello", function() {
    expect("Hello world!").toEqual("Hello world!");
  });
});


describe('MovieViewController Tests', function() {

    beforeEach(angular.mock.module('movieApp.controllers'));

    var scope, $httpBackend, controller, q;

    beforeEach(angular.mock.inject(function($q) {
        // mock a promise
        q = $q;
    }));

    beforeEach(angular.mock.inject(function ($rootScope, _$httpBackend_, $controller) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        controller = $controller;
        $httpBackend
            .when('GET', '/api/movies/1')
            .respond(200, { 'title': 'superman', 'director': 'James Cameron'});
    }));

   afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

   it("get one is correct", function() {
        var stateParams = {id: 1}
        var AuthService = {};
        AuthService.getUserStatus = function(){
            var deferred = q.defer();
            // return true for user logged in
            deferred.resolve(true);
            return deferred.promise;
        };
        var AUTH_EVENTS = {logoutSuccess: 'logout'}

        controller('MovieViewController', {
            $scope: scope,
            $stateParams: stateParams,
            $httpBackend: $httpBackend,
            AuthService: AuthService,
            AUTH_EVENTS: AUTH_EVENTS,
        });

       $httpBackend.flush();

       expect(scope.movie).toEqual({ 'title': 'superman', 'director': 'James Cameron'});
   });

});


describe('MovieListController Tests', function() {

    beforeEach(angular.mock.module('movieApp.controllers'));

    var scope, $httpBackend, controller, q;

    beforeEach(angular.mock.inject(function($q) {
        // mock a promise
        q = $q;
    }));

    beforeEach(angular.mock.inject(function ($rootScope, _$httpBackend_, $controller) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        controller = $controller;
        $httpBackend
            .when('GET', '/api/movies')
            .respond([{ 'title': 'superman', 'director': 'James Cameron'}, { 'title': 'batman', 'director': 'Bill Oddy'}]);

        $httpBackend
            .when('DELETE', '/api/movies/2')
            .respond(200, {'results': 'success'});
    }));

   afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

    it("get all is correct", function() {
       var mypopupService, window;

       var AuthService = {};
        AuthService.getUserStatus = function(){
            var deferred = q.defer();
            // return true for user logged in
            deferred.resolve(true);
            return deferred.promise;
        };
        var AUTH_EVENTS = {logoutSuccess: 'logout'}
        controller('MovieListController', {
            $scope: scope,
            popupService: mypopupService,
            $window: window,
            $httpBackend: $httpBackend,
            AuthService: AuthService,
            AUTH_EVENTS: AUTH_EVENTS,
        });

        $httpBackend.flush();

        expect(scope.selectedOrder).toEqual({id: 'title'})
        expect(scope.order_by_options).toEqual( [{type: 'Title A-Z', id: 'title'}, {type: 'Title Z-A', id: '-title'}, {type: 'Lowest Rating', id: 'rating'}, {type: 'Highest Rating', id: '-rating'}, {type: 'Oldest Release', id:'release_year'}, {type: 'Newest Release', id: '-release_year'}])

        expect(scope.movies).toEqual([{ 'title': 'superman', 'director': 'James Cameron'}, { 'title': 'batman', 'director': 'Bill Oddy'}]);
  });


    it("delete is correct", function() {

        var mypopupService = {showPopup : function(){return true;}}
        var AuthService = {};
        AuthService.getUserStatus = function(){
            var deferred = q.defer();
            // return true for user logged in
            deferred.resolve(true);
            return deferred.promise;
        };
        var AUTH_EVENTS = {logoutSuccess: 'logout'}

        controller('MovieListController', {
            $scope: scope,
            popupService: mypopupService,
            $httpBackend: $httpBackend,
            AuthService: AuthService,
            AUTH_EVENTS: AUTH_EVENTS,
        });

        var movie = {'id': '2', 'title': 'Break Away', 'release_year': '2016'}
        scope.deleteMovie(movie)

        $httpBackend.expectDELETE('/api/movies/2').respond(200, {'results': 'success'});
        $httpBackend.expectGET('/api/movies').respond(200, {'results': [{ 'title': 'superman', 'director': 'James Cameron'}, { 'title': 'batman', 'director': 'Bill Oddy'}]});
        $httpBackend.flush();

  });

});


describe('RatingController Tests', function() {

    beforeEach(angular.mock.module('movieApp.controllers'));

    var scope, controller;

    beforeEach(angular.mock.inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller;
    }));

    it("rating is correct", function() {
        controller('RatingController', {
            $scope: scope
        });

        scope.hoveringOver(2)

        expect(scope.max).toEqual(5)
        expect(scope.isReadonly).toEqual(false);
        expect(scope.overStar).toEqual(2)
        expect(scope.percent).toEqual(40)

  });

});


describe('MovieCreateController Tests', function() {

    beforeEach(angular.mock.module('movieApp.controllers'));
    var scope, $httpBackend, controller;

    beforeEach(angular.mock.inject(function ($rootScope, _$httpBackend_, _$controller_) {
        controller = _$controller_;
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        $httpBackend
            .when('POST', '/api/movies')
            .respond(200, {'id': '1'});

        $httpBackend
            .when('GET', '/api/movies-genres')
            .respond([{'name': 'Action', 'id': '1'}]);
    }));

    it("create movie is correct", function() {
        var state = {'go' : function (){}};
        var AuthService = {'userId' : function (){ return 9; }};

        controller('MovieCreateController', {
            $scope: scope,
            $state: state,
            $httpBackend: $httpBackend,
            AuthService: AuthService,
        });

        spyOn(state, 'go');
        scope.addMovie()

        $httpBackend.expectPOST('/api/movies');
        //$httpBackend.expectGET('/api/movies-genres');
        $httpBackend.flush();
        //$httpBackend.flush();

        expect(scope.movie).toEqual({ release_year: 2016, rating: 3, genre: '1' });
        expect(scope.genres).toEqual([{'name': 'Action', 'id': '1'}]);
        expect(state.go).toHaveBeenCalledWith('viewMovie', {'id':'1'})

  });
});


describe('NavigationController Tests', function() {

    beforeEach(angular.mock.module('movieApp.controllers'));

    var scope, $controller, q;
    beforeEach(angular.mock.inject(function($q) {
        // mock a promise
        q = $q;
    }));

    beforeEach(angular.mock.inject(function ($rootScope, _$controller_) {
        scope = $rootScope.$new();
        $controller = _$controller_;
    }));

    it("Nav is correct", function() {
        var AuthService = {};
        AuthService.getUserStatus = function(){
            var deferred = q.defer();
            // return true for user logged in
            deferred.resolve(true);
            return deferred.promise;
        };
        var AUTH_EVENTS = {loginSuccess: 'login', logoutSuccess: 'logout'}
        var $location = {
            path: function() {return '/movies/1';}
        };
        $controller('NavigationCtrl', {
            $scope : scope,
            $location: $location,
            $state: state,
            AuthService: AuthService,
            AUTH_EVENTS: AUTH_EVENTS,
        });

        var current_page = scope.isCurrentPath('/about');
        expect(current_page).toEqual(false);
        var current_page = scope.isCurrentPath('/movies');
        expect(current_page).toEqual(true);

        var $location = {
            path: function() {return '/about';}
        };
        var state = {'go' : function (){}};
        $controller('NavigationCtrl', {
            $scope : scope,
            $location: $location,
            $state: state,
            AuthService: AuthService,
            AUTH_EVENTS: AUTH_EVENTS,
        });

        var current_page = scope.isCurrentPath('/about');
        expect(current_page).toEqual(true);
        var current_page = scope.isCurrentPath('/movies');
        expect(current_page).toEqual(false);
  });

});



describe('MovieEditController Tests', function() {

    beforeEach(angular.mock.module('movieApp.controllers'));

    var scope, $httpBackend, $controller;

    beforeEach(angular.mock.inject(function ($rootScope, _$httpBackend_, _$controller_) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        scope.movie = {myFile: 'blah', director: 'me', summary: 'sum', id: '1'};
        $controller = _$controller_;
        $httpBackend
            .when('PUT', '/api/movies/1')
            .respond(200, {'id': '1'});

        $httpBackend
            .when('GET', '/api/movies-genres')
            .respond(200, [{'name': 'Action', 'id': '1'}]);

        $httpBackend
            .when('GET', '/api/movies/1')
            .respond(200, {'id': '1', 'name': 'mymovie'});
    }));

    it("edit movie is correct", function() {
        var state = {'go' : function (){}};
        var stateParams = {id: 1}
        var AuthService = {'userId' : function (){ return 9; }};

        var controller = $controller('MovieEditController', {
            $scope: scope,
            $state: state,
            $stateParams: stateParams,
            $httpBackend: $httpBackend,
            AuthService: AuthService,
        });

        spyOn(state, 'go');
        scope.updateMovie()

        $httpBackend.expectPUT('/api/movies/1');
        //$httpBackend.expectGET('/api/movies-genres');
        $httpBackend.flush();
        //$httpBackend.flush();

        expect(scope.movie).toEqual({ id: '1', name: 'mymovie' });
        expect(scope.genres).toEqual([{'name': 'Action', 'id': '1'}]);
        expect(state.go).toHaveBeenCalledWith('viewMovie', {'id':'1'})

  });
});

