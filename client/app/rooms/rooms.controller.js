(function() {
'use strict';

    angular
        .module('app.rooms')
        .controller('RoomsController', RoomsController);

    RoomsController.$inject = ['$scope', 'socket', 'user', 'roomService'];
    function RoomsController($scope, socket, user, roomService) {
        var vm = this;
        
        vm.rooms = roomService.getRoomsByUser(user.uid);
        vm.buildingIsEmpty = false;

        ////////////////
        
        function checkIfbuildingIsEmpty() {
            var empty = true;
            angular.forEach(vm.rooms, function (value, key) {
               if (value.beacons.length > 0) {
                   empty = false;
               }
            });
            vm.buildingIsEmpty = empty;
        }

        socket.on('beacon', function (packet) {
            var presentBeacons = packet;
            for (var i = 0; i < vm.rooms.length; i++) {
                if (vm.rooms[i].address in presentBeacons) {
                    vm.rooms[i].beacons = presentBeacons[vm.rooms[i].address];
                } else {
                    vm.rooms[i].beacons = [];
                }
            }
            
            checkIfbuildingIsEmpty();
        });

        socket.on('connected', function () {
            console.log('connected');
        });

        socket.on('disconnect', function () {
            console.log('disconnected');
        });

        $scope.$on('$destroy', function () {
            // Cleanup code
            socket.disconnect();
        });
    }
})();