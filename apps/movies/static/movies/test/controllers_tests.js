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
        this.$location = {
            path: function() {return '/movies/1';}
        };
        $controller('NavigationCtrl', {
            $scope : this.$scope,
            $location: this.$location
        });

        current_page = this.$scope.isCurrentPath('/about');
        strictEqual(current_page, false, "check return false for active");
        current_page = this.$scope.isCurrentPath('/movies');
        strictEqual(current_page, true, "check return true for movies");

        this.$location = {
            path: function() {return '/about';}
        };
        $controller('NavigationCtrl', {
            $scope : this.$scope,
            $location: this.$location
        });

        current_page = this.$scope.isCurrentPath('/about');
        strictEqual(current_page, true, "check return false for active");
        current_page = this.$scope.isCurrentPath('/movies');
        strictEqual(current_page, false, "check return true for movies");

    });

})();
