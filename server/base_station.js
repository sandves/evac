// This will run on every base station in the building
// and scan for beacons.

var ioSocket = require('socket.io-client');
var socket = ioSocket.connect('http://192.168.5.120:3000', { reconnect: true });
var EddystoneBeaconScanner = require('eddystone-beacon-scanner');
var ip = getServerIp();
var fs = require('fs');
var keypress = require('keypress');
var data = [];
var filename = 'rssi_body_3m_4dBm.txt';
var log = false;
var position = {};

keypress(process.stdin);

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

process.stdin.setRawMode(true);
process.stdin.resume();

process.stdin.on('keypress', function(ch, key) {
    if (key && key.name == 'space') {
        log = !log;
        console.log('Log: ' + log);
    } else if (key && key.ctrl && key.name == 'c') {
        console.log("Caught interrupt signal");
        var dataString = JSON.stringify(data, null, 4);
        fs.writeFileSync(filename, dataString, 'utf8');
        process.exit(2);
    }
});

socket.on('connect', function (socket) {
    console.log('Connected');
});

EddystoneBeaconScanner.on('found', function (beacon) {
    console.log('found beacon');
});

EddystoneBeaconScanner.on('updated', function (beacon) {
    if (typeof beacon.distance !== 'undefined') {
        if (log) {
            data.push(beacon);
        }
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

