(function() {
    'use strict';

    angular
        .module('evacApp')
        .controller('home.ctrl', homeController);

    homeController.$inject = ['$scope', '$location'];

    function homeController($scope, $location) {

        // TODO implement home controller
        $scope.test = "Test";

        $scope.login = function() {
        	$location.path('/beacons');
        }
        
    }

})();
