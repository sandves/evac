(function() {
'use strict';

    angular
        .module('app.rooms')
        .controller('RoomsController', RoomsController);

    RoomsController.$inject = ['$scope', 'socket'];
    function RoomsController($scope, socket) {
        var vm = this;
        
        vm.rooms = [
          {
              name: 'Loft',
              address: '192.168.5.111',
              beacons: []
          },
          {
              name: 'Hovedetasje',
              address: '192.168.5.112',
              beacons: []
          }  
        ];

        ////////////////

        socket.on('beacon', function (packet) {
 
            var presentBeacons = packet;
            for (var i = 0; i < vm.rooms.length; i++) {
                if (vm.rooms[i].address in presentBeacons) {
                    vm.rooms[i].beacons = presentBeacons[vm.rooms[i].address];
                } else {
                    vm.rooms[i].beacons = [];
                }
            }
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