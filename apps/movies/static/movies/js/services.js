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
              .post('/api/login/', credentials)
              .then(function (res) {
                console.log(res)
                Session.create(res.data.id, res.data.user.id, res.data.user.role);
                return res.data.user;
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
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
});
