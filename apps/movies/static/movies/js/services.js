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
                    Session.create('sessionid', 9999, credentials.username); // hack while we wait to retrieve
                    authService.getUser()
                        .then(function successCallback(data) {
                            Session.create('sessionid', data.pk, data.username);
                            return data.username;
                        });
                });
        };

        authService.getUserStatus = function() {
            // Used on initial load of the app to get the user status (logged in or not)
            return $http({
                        method: 'GET',
                        url: '/api/user-status/',
                    })
                    .then(function(res) {
                        if (res.data.loggedin === true){
                            authService.getUser()
                                .then(function successCallback(data) {
                                    Session.create('sessionid', data.pk, data.username);
                                });
                        }
                        return res.data.loggedin;
                    });
        };

        authService.getUser = function() {
            // Used to get user details from bacend such as ID and username
            return $http({
                        method: 'GET',
                        url: '/rest-auth/user/',
                    })
                    .then(function(res) {
                        return res.data;
                    });
        };

        authService.isAuthenticated = function() {
            return Session.userId !== null;
        };

        authService.username = function() {
            return Session.userName;
        };

        authService.userId = function() {
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
        // Stores the session id, user id and the user name.
        this.create = function(sessionId, userId, userName) {
            this.id = sessionId;
            this.userId = userId;
            this.userName = userName;
        };
        this.destroy = function() {
            this.id = null;
            this.userId = null;
            this.userName = null;
        };
    });
