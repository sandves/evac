(function() {
    'use strict';

    angular
        .module('app.floorplan')
        .directive('evacRoom', roomDirective);

    function roomDirective() {

        var directive = {
            bindToController: true,
            templateUrl: 'app/floorplan/directives/room.html',
            controller: RoomController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                room: '='
            }
        };
        return directive;
        
    }
    /* @ngInject */
    function RoomController () {
        var vm = this;
        var room = vm.room;
        
        vm.roomStyle = {
            'width': room.width + 'px',
            'height': room.height + 'px',
            'top': room.top + 'px',
            'left': room.left + 'px',
            'line-height': room.height + 'px'
        };
    }
})();