(function () {
    'use strict';

    angular
        .module('app.beacons')
        .controller('BeaconsController', BeaconsController);

    BeaconsController.$inject = ['$scope', 'socket', 'beaconService'];

    function BeaconsController($scope, socket, beaconService) {
        var vm = this;

        vm.debug = false;

        vm.rssi = null;
        vm.distance = null;
        vm.connected = false;
        vm.lastUpdate = null;
        vm.connectionState = 'closed';
        vm.url = '';

        vm.dist = 3;
        vm.prediction = 4.5;

        socket.on('beacon-updated', function (beacon) {
            vm.rssi = beacon.rssi + 'dBm';
            var distance = 'unknown';
            if (typeof beacon.distance !== 'undefined') {
                vm.dist = beacon.distance < 10 ? beacon.distance : 10;
                vm.prediction = beacon.prediction < 10 ? beacon.prediction : 10;
                distance = beacon.distance.toFixed(3) + 'm';
            }
            var calculatedDistance = beaconService.getRange(beacon.txPower, beacon.rssi);
            if (isNaN(calculatedDistance)) {
                calculatedDistance = 'unknown';
            }
            else {
                calculatedDistance = calculatedDistance + 'm';
            }
            vm.distance = distance + ' (' + calculatedDistance + ')';
            vm.lastUpdate = new Date();
            vm.url = beacon.url;
        });

        socket.on('connected', function () {
            vm.connected = true;
            vm.connectionState = 'open';
        });

        socket.on('disconnect', function () {
            vm.connected = false;
            vm.connectionState = 'closed';
            vm.rssi = null;
            vm.distance = null;
        });

        $scope.$on('$destroy', function () {
            // Cleanup code
            socket.disconnect();
        });
    }

})();