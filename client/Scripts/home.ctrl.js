(function() {
    'use strict';

    angular
        .module('evacApp')
        .controller('home.ctrl', homeController);

    homeController.$inject = ['$scope'];

    function homeController($scope) {

        // TODO implement home controller
        $scope.test = "Test";
        
    }

})();
