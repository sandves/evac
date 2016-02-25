(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('FIREBASE_URL', 'https://burning-inferno-9647.firebaseio.com/')
        .constant('SOCKET_URL', 'http://192.168.5.120:3000')
        .constant('PROTECTED_PATHS', ['/beacons', '/floorplan']);

})();
