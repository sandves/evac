// This will run on every base station in the building
// and scan for beacons.

var ioSocket = require('socket.io-client');
var socket = ioSocket.connect('http://192.168.5.120:3000', { reconnect: true });
var EddystoneBeaconScanner = require('eddystone-beacon-scanner');
var ip = getServerIp();

socket.on('connect', function (socket) {
    console.log('Connected');
});

EddystoneBeaconScanner.on('found', function (beacon) {
    console.log('found beacon');
});

EddystoneBeaconScanner.on('updated', function (beacon) {
    if (typeof beacon.distance !== 'undefined') {
        var distance = beacon.distance;
        var packet = {
            beacon: beacon,
            ip: ip
        };
        socket.emit('bs-updated', packet);
        console.log(beacon.distance + ' (' + beacon.rssi + ')');
    }
    else {
        console.log(beacon);
    }
});

EddystoneBeaconScanner.on('lost', function (beacon) {
    var packet = {
        beacon: beacon,
        ip: ip  
    };
    socket.emit('bs-lost', packet);
});

EddystoneBeaconScanner.startScanning(true);
console.log(getServerIp());

function getServerIp() {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var values = Object.keys(ifaces).map(function (name) {
        return ifaces[name];
    });
    values = [].concat.apply([], values).filter(function (val) {
        return val.family === 'IPv4' && val.internal === false;
    });

    return values.length ? values[0].address : '0.0.0.0';
}
