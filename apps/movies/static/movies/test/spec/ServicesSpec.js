'use strict';


describe('PopupService Tests', function(){

    beforeEach(angular.mock.module('movieApp.services'));

    var _$window_ = {confirm : function(){return true;}}
    var service;

    beforeEach(angular.mock.inject(function ($service, $window) {
        service = $service,
        $window = _$window_
    }));



//    it('show popup', function(){

//        service('popupService', {
//            $window: window
//        });

//    var result = showPopup();


//        expect(result).toEqual(true);
//    })

});
