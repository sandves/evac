var EddystoneBeaconScanner = require('eddystone-beacon-scanner');
var app = require('express')();
var server = require('http').Server(app);
var ioSocket = require('socket.io')(server);
var filters = require('./filters.js');

server.listen(3000);

ioSocket.on('connection', function (socket) {
    console.log('client connected');
    socket.emit('connected', { hello: 'world' });
    socket.on('bar', function (data) {
        console.log(data);
    });
});

EddystoneBeaconScanner.on('found', function (beacon) {
    console.log('found beacon');
});

EddystoneBeaconScanner.on('updated', function (beacon) {
    if (typeof beacon.distance !== 'undefined') {
        var distance = beacon.distance;
        var prediction = filters.kalman({
            pageX: 0,
            pageY: distance
        });
        beacon.prediction = prediction.y;
        ioSocket.sockets.emit('beacon-updated', beacon);
        console.log(beacon.distance + ' (' + beacon.rssi + ')');
    }
    else {
        console.log(beacon);
    }
});

EddystoneBeaconScanner.on('lost', function (beacon) {
    console.log('lost beacon');
});

EddystoneBeaconScanner.startScanning(true);
