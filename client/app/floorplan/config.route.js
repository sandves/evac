(function () {
    'use strict';

    angular
        .module('app.floorplan')
        .config(configFunction);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider) {
        $routeProvider.when('/floorplan', {
            templateUrl: 'app/floorplan/floorplan.html',
            controller: 'FloorplanController',
            controllerAs: 'vm',
            resolve: { user: resolveUser }
        });
    }

    resolveUser.$inject = ['authService'];

    function resolveUser(authService) {
        return authService.firebaseAuthObject.$requireAuth();
    }

})();
