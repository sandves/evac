(function () {
    'use strict'

    angular
        .module('evacApp')
        .controller('beacon.ctrl', beaconController);

    beaconController.$inject = ['$scope', 'socket'];

    function beaconController($scope, socket) {

    	$scope.rssi = 0;
    	$scope.distance = 0;
    	$scope.connected = false;

        socket.on('beacon-updated', function(beaconData) {
        	$scope.rssi = beaconData.rssi;
        	$scope.distance = beaconData.distance.toFixed(2) + 'm';
        });

        socket.on('connected', function() {
        	$scope.connected = true;
        }); 
        
    }
})();
