'use strict';

angular.module('movieApp.services', [])
    .service('popupService', function($window) {
        this.showPopup = function(message) {
            return $window.confirm(message);
        };
    })
    .factory('AuthService', function($q, $http, Session) {
        var authService = {};

        authService.login = function(credentials) {
            return $http({
                    method: 'POST',
                    url: '/rest-auth/login/',
                    data: JSON.stringify(credentials),
                })
                .then(function(res) {
                    Session.create(res.data.key, credentials.username);
                    return credentials.username;
                });
        };

        authService.getUser = function() {
            // Used on initial load of the app to get the user (if logged in)
            return $http({
                    method: 'GET',
                    url: '/api/current-user/',
                })
                .then(function(res) {
                    if (res.data.loggedin === true){
                        Session.create('sesh', res.data.username);
                    }
                    return res.data;
                });
        };

        authService.isAuthenticated = function() {
            return !!Session.userId;
        };

        authService.username = function() {
            return Session.userId;
        };

        authService.logout = function(credentials) {
            return $http({
                    method: 'POST',
                    url: '/rest-auth/logout/',
                })
                .then(function(res) {
                    Session.destroy();
                });
        };

        return authService;
    })
    .service('Session', function() {
        // Stores the session id and the user id.
        this.create = function(sessionId, userId) {
            this.id = sessionId;
            this.userId = userId;
        };
        this.destroy = function() {
            this.id = null;
            this.userId = null;
        };
    });
