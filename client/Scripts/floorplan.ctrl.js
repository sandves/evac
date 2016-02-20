(function() {
    'use strict';

    angular
        .module('evacApp')
        .controller('floorplan.ctrl', floorplanController);

    floorplanController.$inject = ['$scope'];

    function floorplanController($scope) {

        $scope.rooms = ['1012', '1013'];
        
    }

})();
