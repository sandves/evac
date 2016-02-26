// This is the central server that receives information
// about all the detected beacons inside the building.
// It filters and processes the information before emitting
// it to the connected clients.

var app = require('express')();
var server = require('http').Server(app);
var ioSocket = require('socket.io')(server);
var filters = require('./filters.js');

server.listen(3000);

var beacons = {};

ioSocket.on('connection', function (socket) {
    var address = socket.handshake.address;
    console.log('New connection from ' + address.address +
        ':' + address.port);
});

ioSocket.on('bs-updated', function (packet) {
    var beacon = packet.beacon;
    var distance = beacon.distance;
    var prediction = filters.kalman({
        pageX: 0,
        pageY: distance
    });
    beacon.prediction = prediction.y;
    beacons[packet.ip][beacon.instance] = beacon;
    ioSocket.sockets.emit('beacon-updated', beacon);
    console.log(beacon.distance + ' (' + beacon.rssi + ')');
});

// Predict the beacons positions by assuming that the base station
// that receives the strongest signal is the closest one.
function getLocations() {
    var distances = {};
    for (var ip in beacons) {
        if (beacons.hasOwnProperty(ip)) {
            for (var instance in beacons[ip]) {
                if (beacons[ip].hasOwnProperty(instance)) {
                    if (distances[instance]) {
                        if (distances[instance].prediction < beacons[ip][instance].prediction) {
                            distances[instance] = beacons[ip][instance];
                        } else {
                            distances[instance] = beacons[ip][instance];
                        }
                    }
                }
            }
        }
    }
}