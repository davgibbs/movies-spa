'use strict';


describe('PopupService Tests', function(){

    beforeEach(angular.mock.module('movieApp.services', 
        // mock the window dependency
        function ($provide) {
            $provide.factory('$window', function () {
                var windowmock = jasmine.createSpy('$window');
                windowmock.confirm = function(){return true;};
                return windowmock;
            });
        }

    ));

    var popupService;

    beforeEach(angular.mock.inject(function (_popupService_) {
        popupService = _popupService_;
    }));

    it('show popup true', function(){

        expect(angular.isFunction(popupService.showPopup)).toBe(true);
        var result = popupService.showPopup('hello');
        expect(result).toBe(true);

    });

});

describe('Session Tests', function(){

    beforeEach(angular.mock.module('movieApp.services'));

    var Session;

    beforeEach(angular.mock.inject(function (_Session_) {
        Session = _Session_;
    }));

    it('session true', function(){

        expect(angular.isFunction(Session.create)).toBe(true);
        Session.create(11, 'username');
        expect(Session.userId).toBe(11);
        expect(Session.userName).toBe('username');

        Session.destroy();
        expect(Session.userId).toBe(null);
        expect(Session.userName).toBe(null);

    });

});

describe('AuthService Tests', function(){

    beforeEach(angular.mock.module('movieApp.services',
        // mock the window dependency
        function ($provide) {
            $provide.factory('Session', function () {
                var sessionmock = jasmine.createSpy('Session');
                sessionmock.userName = 'test-user';
                sessionmock.userId = 1;
                return sessionmock;
            });
        }
    ));

    var AuthService;

    beforeEach(angular.mock.inject(function (_AuthService_, Session) {
        AuthService = _AuthService_;
    }));

    it('is authenticated', function(){

        expect(angular.isFunction(AuthService.isAuthenticated)).toBe(true);
        var authenticated = AuthService.isAuthenticated();
        expect(authenticated).toBe(true);

        var username = AuthService.username();
        expect(username).toBe('test-user');

        var userid = AuthService.userId();
        expect(userid).toBe(1);

    });

    it('get user is sucessful', function(){
        expect(angular.isFunction(AuthService.getUser)).toBe(true);
    });

});
