(function () {
    'use strict';

    angular
        .module('app.beacons')
        .config(configFunction);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider) {
        $routeProvider.when('/beacons', {
            templateUrl: 'app/beacons/beacons.html',
            controller: 'BeaconsController',
            controllerAs: 'vm',
            resolve: { user: resolveUser }
        });
    }

    resolveUser.$inject = ['authService'];

    function resolveUser(authService) {
        return authService.firebaseAuthObject.$requireAuth();
    }

})();
