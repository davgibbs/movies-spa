'use strict';

angular.module('movieApp.services', []).service('popupService', function($window) {
    this.showPopup = function(message) {
        return $window.confirm(message);
    };
})
.service('AuthService', function ($http) {
    var authService = {};

    authService.login = function (credentials) {
        return $http
          .post('/login', credentials)
          .then(function (res) {
            return res.data.user;
          });
    };

    return authService;

});
