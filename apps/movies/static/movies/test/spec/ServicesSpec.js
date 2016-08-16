'use strict';


describe('PopupService Tests', function(){

    beforeEach(angular.mock.module('movieApp.services', 
        // mock the window dependency
        function ($provide) {
            $provide.factory('$window', function () {
                var windowmock = jasmine.createSpy('$window');
                windowmock.confirm = function(){return true;}
                return windowmock
            });
            }

        ));

    var popupService;

    beforeEach(angular.mock.inject(function (_popupService_) {
        popupService = _popupService_
    }));

    it('show popup true', function(){

        expect(angular.isFunction(popupService.showPopup)).toBe(true);
        var result = popupService.showPopup('hello');
        expect(result).toBe(true);

    })

});
