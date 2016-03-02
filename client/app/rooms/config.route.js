(function () {
    'use strict';

    angular
        .module('app.rooms')
        .config(configFunction);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider) {
        $routeProvider
            .when('/rooms', {
                templateUrl: 'app/rooms/rooms.html',
                controller: 'RoomsController',
                controllerAs: 'vm',
                resolve: { user: resolveUser }
            })
            .when('/editrooms', {
                templateUrl: 'app/rooms/edit.html',
                controller: 'EditController',
                controllerAs: 'vm',
                resolve: { user: resolveUser }
            });
    }

    resolveUser.$inject = ['authService'];

    function resolveUser(authService) {
        return authService.firebaseAuthObject.$requireAuth();
    }

})();
