(function () {
    'use strict'

    config.$inject = ['$routeProvider', '$locationProvider'];

    var app = angular.module('evacApp', [
        'ngRoute'
    ]); // Inject dependecies here

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
