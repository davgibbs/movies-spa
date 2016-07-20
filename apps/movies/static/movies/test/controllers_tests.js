(function() {

    var $controller, $location;

    module("NavigationCtrl Tests", {
        setup: function() {
            var injector = angular.injector([ 'ng', 'movieApp' ]);
            this.$scope = injector.get('$rootScope').$new();

            $location = {
                path: function() {return '/movies/1';}
            };

            $controller = injector.get('$controller');
            $controller('NavigationCtrl', {
                $scope : this.$scope,
                $location: $location
            });
        }
    });

    test("NavigationCtrl", function() {
        current_page = this.$scope.isCurrentPath('/about');
        strictEqual(current_page, false, "check return false for active");

        current_page = this.$scope.isCurrentPath('/movies');
        strictEqual(current_page, true, "check return true for movies");
    });

})();
