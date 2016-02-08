(function () {
    'use strict'

    angular
        .module('evacApp')
        .controller('beacon.ctrl', beaconController);

    beaconController.$inject = ['$scope', 'socket'];

    function beaconController($scope, socket) {

    	$scope.debug = false;

    	$scope.rssi = null;
    	$scope.distance = null;
    	$scope.connected = false;
    	$scope.lastUpdate = null;
    	$scope.connectionState = 'closed';
    	$scope.url = '';

    	$scope.dist = 0;
    	$scope.prediction = 0;

        socket.on('beacon-updated', function(beacon) {
        	$scope.rssi = beacon.rssi + 'dBm';
        	var distance = 'unknown';
        	if (typeof beacon.distance != 'undefined') {
        		$scope.dist = beacon.distance < 10 ? beacon.distance : 10;
        		$scope.prediction = beacon.prediction < 10 ? beacon.prediction : 10;
        		var distance = beacon.distance.toFixed(3) + 'm';
        	}
        	var calculatedDistance = getRange(beacon.txPower, beacon.rssi);
        	if (isNaN(calculatedDistance))
        		calculatedDistance = 'unknown';
        	else
        		calculatedDistance = calculatedDistance + 'm';
        	$scope.distance = distance + ' (' + calculatedDistance + ')';
        	$scope.lastUpdate = new Date();
        	$scope.url = beacon.url;
        });

        socket.on('connected', function() {
        	$scope.connected = true;
        	$scope.connectionState = 'open';
        }); 

        socket.on('disconnect', function() {
        	$scope.connected = false;
        	$scope.connectionState = 'closed';
        	$scope.rssi = null;
        	$scope.distance = null;
        });

        function calculateAccuracy(txPower, rssi) {
        	
        	if (rssi == 0) {
			    return -1.0;
	        }

	        var ratio = rssi * 1.0 / txPower;
	        if (ratio < 1.0) {
	          return Math.pow(ratio, 10);
	        }
	        else {
	          var accuracy = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;    
	          return accuracy;
	        }
        }

        function getRange(txCalibratedPower, rssi) {
		    var ratio_db = txCalibratedPower - rssi;
		    var ratio_linear = Math.pow(10, ratio_db / 10);

		    var r = Math.sqrt(ratio_linear) / 100.0;
		    return parseFloat(r.toFixed(3)); 	
		}
        
    }
})();
