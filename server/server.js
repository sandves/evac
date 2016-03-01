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
    console.log('New connection');
    socket.on('bs-updated', baseStationUpdated);
});

function baseStationUpdated(packet) {
    var beacon = packet.beacon;
    var distance = beacon.distance;
    var prediction = filters.kalman({
        pageX: 0,
        pageY: distance
    });
    beacon.prediction = prediction.y;
    if (!beacons[beacon.id]) {
        beacons[beacon.id] = {};
    }
    beacons[beacon.id][packet.ip] = beacon;
    console.log(beacon.prediction);

    var presentBeacons = {};
    for (var id in beacons) {
        if (beacons.hasOwnProperty(id)) {
            var nearestBaseStation = getNearest(id);
            if (beaconWasRecentlySeen(beacons[id][nearestBaseStation])) {
                if (!presentBeacons[nearestBaseStation]) {
                    presentBeacons[nearestBaseStation] = [];
                }
                presentBeacons[nearestBaseStation].push(id);
            }
        }
    }
    ioSocket.sockets.emit('beacon', presentBeacons);
}

function beaconWasRecentlySeen(beacon) {
    var now = (new Date()).getTime();
    var dt = now - beacon.lastSeen;
    if (dt < 5000) {
        return true;
    } else {
        return false;
    }
}

// Predict the beacons positions by assuming that the base station
// that receives the strongest signal is the closest one.
function getNearest(beaconId) {
    var baseStations = beacons[beaconId];
    // If only one base station is in range of the beacon,
    // return the address of the base station.
    if (Object.keys(baseStations).length) {
        return Object.keys(baseStations)[0];
    }
    
    // Search for the basestation that is closest to the beacon
    // and return the address of the base station.
    var nearestBaseStation = 1000;
    for (var address in baseStations) {
        if (baseStations.hasOwnProperty(address)) {
            console.log(address, baseStations[address]);
            if (baseStations[address].prediction < nearestBaseStation) {
                nearestBaseStation = address;
            }
        }
    }
    return nearestBaseStation;
}
