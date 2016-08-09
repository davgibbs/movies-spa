'use strict';

angular.module('movieApp.services', []).service('popupService', function($window) {
    this.showPopup = function(message) {
        return $window.confirm(message);
    };
});