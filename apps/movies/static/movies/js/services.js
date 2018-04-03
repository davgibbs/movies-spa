'use strict';

angular.module('movieApp.services', [])
.service('popupService', function($window) {
    this.showPopup = function(message) {
        return $window.confirm(message);
    };
})
.service('AuthService', function ($http, Session) {
    var authService = {};

    authService.login = function (credentials) {
        return $http({
                    method: 'POST',
                    url: '/rest-auth/login/',
                    data: JSON.stringify(credentials),
                })
                .then(function (res) {
                      Session.create(res.data.key, credentials.username);
                      return credentials.username;
                  });
    };

    return authService;
})

.service('Session', function () {
  this.create = function (sessionId, userId) {
    console.log(sessionId)
    console.log(userId)
    this.id = sessionId;
    this.userId = userId;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
  };
});
