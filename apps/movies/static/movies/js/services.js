'use strict';

angular.module('movieApp.services',[]).factory('Movie',function($resource){
    return $resource('/api/movies/:id',{id:'@id'},{
        update: {
            method: 'PUT'
        }
    });
}).service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    };
});
