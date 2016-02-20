(function () {
    'use strict'

    config.$inject = ['$routeProvider', '$locationProvider'];

    var app = angular.module('evacApp', [
        // Angular dependecies
        'ngRoute',

        // 3rd party dependencies
        'btford.socket-io',
        'angularMoment',

        // Custom dependencies
        'beacon'
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
            .when('/floorplan', {
                templateUrl: 'templates/floorplan.tmpl.html',
                controller: 'floorplan.ctrl'
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
