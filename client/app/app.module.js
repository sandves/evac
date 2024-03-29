(function () {
    'use strict';

    angular
        .module('app', [
        // Angular modules.
            'ngRoute',

        // Third party modules.
            'firebase',

        // Custom modules.
            'app.auth',
            'app.core',
            'app.landing',
            'app.layout',
            'app.beacons',
            'app.floorplan',
            'app.rooms'
        ])
        .config(configFunction)
        .run(runFunction);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }

    runFunction.$inject = ['$rootScope', '$location'];

    function runFunction($rootScope, $location) {
        $rootScope.$on('$routeChangeError', function (event, next, previous, error) {
            if (error === 'AUTH_REQUIRED') {
                var fallback = next.$$route.originalPath;
                $location.path('/login' + fallback);
            }
        });
    }

})();
