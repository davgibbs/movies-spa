//(function() {


var $controller, $location;

module("NavigationCtrl Tests", {
    setup: function() {
        var injector = angular.injector([ 'ng', 'movieApp' ]);
        scope = injector.get('$rootScope').$new();

        $location = {
            path: function() {return '/movies/1';}
        };

        controller = injector.get('$controller');
        controller('NavigationCtrl', {
            $scope : scope,
            $location: $location
        });
    }
});

test("NavigationCtrl", function() {
    current_page = scope.isCurrentPath('/about');
    strictEqual(current_page, false, "check return false for active");

    current_page = scope.isCurrentPath('/movies');
    strictEqual(current_page, true, "check return true for movies");
});

//})();
