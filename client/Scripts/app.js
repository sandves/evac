(function () {
    'use strict'

    config.$inject = ['$routeProvider', '$locationProvider'];

    var app = angular.module('evacApp', [
        // Angular dependecies
        'ngRoute',

        // 3rd party dependencies
        'btford.socket-io',
        'angularMoment'
    ]);

    app.config(config);

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/beacons', {
                templateUrl: 'templates/beacons.html',
                controller: 'beacon.ctrl'
            })
            .when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'home.ctrl'
            })
            .otherwise({
                redirectTo: '/home'
            });

        /*$locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });*/
    }
})();
