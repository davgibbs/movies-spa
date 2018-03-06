'use strict';

angular.module('movieApp.services', []).service('popupService', function($window) {
    this.showPopup = function(message) {
        return $window.confirm(message);
    };
})
.service('AuthService', function ($http, Session) {
    var authService = {};

    authService.login = function (credentials) {
        return $http
              .post('/api-auth/login/', credentials)
              .then(function (res) {
                  Session.create(res.data.id, res.data.username);
                  return res.data.username;
              });
    };

    return authService;
})
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
})
.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
  };
});
