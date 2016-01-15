(function () {
    'use strict'

    config.$inject = ['$routeProvider', '$locationProvider'];

    var app = angular.module('corepApp', ['ngRoute']) // Inject dependecies here

    app.config(config);

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/beacons', {
                templateUrl: 'templates/beacons.html',
                controller: 'beacon.ctrl'
            })
            .otherwise({
                redirectTo: '/beacons'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
    }
}();
