(function() {
'use strict';

    angular
        .module('app.beacons')
        .factory('beaconService', beaconService);

    function beaconService() {
        var service = {
            calculateAccuracy: calculateAccuracy,
            getRange: getRange
        };
        
        return service;

        ////////////////
        function calculateAccuracy(txPower, rssi) {

            if (rssi === 0) {
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
            var ratioDb = txCalibratedPower - rssi;
            var ratioLinear = Math.pow(10, ratioDb / 10);

            var r = Math.sqrt(ratioLinear) / 100.0;
            return parseFloat(r.toFixed(3));
        }
    }
})();