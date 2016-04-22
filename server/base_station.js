// This will run on every base station in the building
// and scan for beacons.

var ioSocket = require('socket.io-client');
var socket = ioSocket.connect('http://192.168.5.120:3000', { reconnect: true });
var EddystoneBeaconScanner = require('eddystone-beacon-scanner');
var ip = getServerIp();
var fs = require(fs);
var logger = fs.createWriteStream('log.txt', {
    flags: 'a'
});

var position = {};

if (ip === '192.168.5.110') {
    position.x = 2.55;
    position.y = 6.35;
} else if (ip === '192.168.5.111') {
    position.x = 5.1;
    position.y = 3.85;
} else if (ip === '192.168.5.112') {
    position.x = 0;
    position.y = 1.85;
} else {
    position.x = 0;
    position.y = 0;
}

socket.on('connect', function (socket) {
    console.log('Connected');
});

EddystoneBeaconScanner.on('found', function (beacon) {
    console.log('found beacon');
});

EddystoneBeaconScanner.on('updated', function (beacon) {
    logger.write(JSON.stringify(beacon));
    if (typeof beacon.distance !== 'undefined') {
        var packet = {
            beacon: beacon,
            ip: ip,
            position: position
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

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    logger.end();
    process.exit(2);
});
