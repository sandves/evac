(function () {
    'use strict';

    angular
        .module('app.layout')
        .directive('gzNavbar', gzNavbar);

    function gzNavbar() {
        return {
            templateUrl: 'app/layout/navbar.html',
            restrict: 'E',
            scope: {},
            controller: NavbarController,
            controllerAs: 'vm'
        };
    }

    NavbarController.$inject = ['$location', 'authService'];

    function NavbarController($location, authService) {
        var vm = this;

        vm.isLoggedIn = authService.isLoggedIn;
        vm.logout = logout;
        vm.isActive = isActive;

        function logout() {
            authService.logout();
            $location.path('/');
        }

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }

        // Ugly hack to hide the collapsed navbar menu when a navigation
        // link is clicked. Note that the menu should not hide if a dropdown
        // menu is clicked.
        $('.nav :not(.dropdown) a').on('click', function () {
            $('.navbar-collapse').collapse('hide');
        });

    }

})();