(function () {
    'use strict';

    angular
        .module('app.floorplan')
        .controller('FloorplanController', FloorplanController);

    FloorplanController.$inject = ['$scope', 'socket'];
    function FloorplanController($scope, socket) {
        var vm = this;

        vm.rooms = [
            {
                name: 'Foo',
                address: '192.168.5.111',
                width: 100,
                height: 50,
                top: 20,
                left: 20,
                beacons: []
            },
            {
                name: 'Bar',
                address: '192.168.5.112',
                width: 100,
                height: 100,
                top: 100,
                left: 20,
                beacons: []
            }/*,
            {
                name: 'Baz',
                width: 300,
                height: 180,
                top: 20,
                left: 150,
                beacons: []
            },
            {
                name: 'Qux',
                width: 300,
                height: 300,
                top: 230,
                left: 150,
                beacons: []
            }, {
                name: 'Norf',
                width: 100,
                height: 300,
                top: 230,
                left: 20,
                beacons: []
            }*/
        ];

        vm.test = test;

        function test() {
            vm.rooms[3].name = 'stian';
        }

        var roomAddresses = {
            '192.168.5.111': 'Foo',
            '192.168.5.112': 'Bar'
        };

        function pushIfNew(array, obj) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === obj) {
                    return;
                }
            }
            array.push(obj);
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