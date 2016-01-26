var EddystoneBeaconScanner = require('eddystone-beacon-scanner');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

/*app.get('/', function(req, res) {
    console.log('get request');
    res.sendFile(__dirname + '/index.html');
})*/

io.on('connection', function(socket){
    console.log('client connected');
    socket.emit('connected', {hello: 'world'});
    socket.on('bar', function(data) {
        console.log(data);
    });
});

/*setInterval(function() {
    console.log('emitting mock beacon');

    var rssi = parseInt(getRandom(-50, -110));
    var distance = getRandom(0.5, 20.0);

    var beacon = {
        rssi: rssi,
        distance: distance,
        url: 'www.vg.no',
        txPower: -16
    };

    io.sockets.emit('beacon-updated', beacon)
}, 1000);

function getRandom(min, max) {
    var number = (Math.random() * (max - min) + min);
    console.log(number);
    return number;
}*/

/*EddystoneBeaconScanner.on('found', function(beacon) {
    console.log('found beacon');
  //console.log('found Eddystone Beacon:\n', JSON.stringify(beacon, null, 2));
});

EddystoneBeaconScanner.on('updated', function(beacon) {
    io.sockets.emit('beacon-updated', beacon);
    console.log(beacon.distance + ' (' + beacon.rssi + ')');
  //console.log('updated Eddystone Beacon:\n', JSON.stringify(beacon, null, 2));
});

EddystoneBeaconScanner.on('lost', function(beacon) {
    console.log('lost beacon');    
});

EddystoneBeaconScanner.startScanning(true);*/

var noble = require('noble');

var beacons = {
    // '38d99a8307714a1b80702de588ae1360', 
    'd32b4cab73ee4b8eb31d95c8a17727cc': {
        name: 'Ice',
        discovered: false
    },
    '10ddfc5eb90441d4888e23216beadf36': {
        name: 'Mint',
        discvoered: false
    },
    '9f9a5e64f83648218096168fe4d4b4e8': {
        name: 'Blueberry',
        discovered: false
    }
};

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
    if (beacons[peripheral.uuid]) {
        var beacon = beacons[peripheral.uuid];
        console.log(beacon.name + ': ' + peripheral.rssi + ' (' + peripheral.advertisement.txPowerLevel + ')');
    }
});
