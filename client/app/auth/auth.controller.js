(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$location', 'authService', '$routeParams'];

    function AuthController($location, authService, $routeParams) {
        var vm = this;
        
        vm.error = null;

        vm.register = register;
        vm.login = login;

        function register(user) {
            return authService.register(user)
                .then(function () {
                    return vm.login(user);
                })
                .then(function () {
                    return authService.sendWelcomeEmail(user.email);
                })
                .catch(function (error) {
                    vm.error = error;
                });
        }

        function login(user) {
            return authService.login(user)
                .then(function () {
                    if ($routeParams.fallback) {
                        $location.path('/' + $routeParams.fallback);
                    } else {
                        $location.path('/floorplan');
                    }
                })
                .catch(function (error) {
                    vm.error = error;
                });
        }
    }

})();