(function () {
    'use strict';

    angular
        .module('app.floorplan')
        .controller('FloorplanController', FloorplanController);

    FloorplanController.$inject = ['socket'];
    function FloorplanController(socket) {
        var vm = this;

        vm.rooms = [
            {
                name: 'Foo',
                width: 100,
                height: 50,
                top: 20,
                left: 20,
                beacons: []
            },
            {
                name: 'Bar',
                width: 100,
                height: 100,
                top: 100,
                left: 20,
                beacons: []
            },
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
            }
        ];

        vm.test = test;

        function test() {
            vm.rooms[3].name = 'stian';
        }

        var roomAddresses = {
            '192.168.5.111': 'Foo',
            '192.168.5.112': 'Bar'
        };

        socket.on('beacon', function (packet) {
            if (packet.baseStation === '192.168.5.111') {
                vm.rooms[0].beacons.push(packet.beacon);
            } else if (packet.baseStation === '192.168.5.112') {
                vm.rooms[1].beacons.push(packet.beacon);
            }
        });
    }
})();