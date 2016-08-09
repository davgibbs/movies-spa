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

    beforeEach(module('movieApp'));

    var scope, httpBackend;

        console.log('w');

    beforeEach(inject(function($injector){
        console.log('ss');
        httpBackend = $injector.get('$httpBackend')
        scope = $injector.get('$rootScope').$new()
    }));

    it('should return movie details', function(){
        httpBackend.when('GET', '/api/movies/1')
            .respond({'name': 'movie1'})

        stateParams = {
            id: 1
        };

        $controller('MovieViewController', {
            $scope : scope,
            $stateParams: stateParams,
            $http : http
        });

        expect(scope.movie).toEqual({'name': 'movie1'});

    });

});
