// This is the central server that receives information
// about all the detected beacons inside the building.
// It filters and processes the information before emitting
// it to the connected clients.

var app = require('express')();
var server = require('http').Server(app);
var ioSocket = require('socket.io')(server);
var filters = require('./filters.js');
var positioning = require('./trilateration.js');

// Logging setup
var fs = require('fs');
var data = [];
var keypress = require('keypress');
keypress(process.stdin);
var filename = 'poisition_estimates_adaptive.json';
var log = false;
process.stdin.setRawMode(true);
process.stdin.resume();
////

var gammaList = {};
var gammaAverage = 2.0;

server.listen(3000);

var beacons = {};

process.stdin.on('keypress', function(ch, key) {
   if (key && key.name === 'space') {
       log = !log;
       console.log('Log: ' + log);
   } else if (key && key.ctrl && key.name === 'c') {
       console.log('Caught interrupt signal');
       if (data.length > 0) {
           var dataString = JSON.stringify(data, null, 4);
           fs.writeFileSync(filename, dataString, 'utf8');   
       }
       process.exit(2);
   }
});

ioSocket.on('connection', function (socket) {
    console.log('New connection');
    socket.on('bs-updated', baseStationUpdated);
    socket.on('bs-lost', baseStationLost);
    socket.on('gamma-updated', gammaUpdated);
});

function baseStationLost(packet) {
    delete beacons[packet.beacon.id][packet.ip];
    console.log('lost');
    broadCastPresentBeacons();
}

function gammaUpdated(packet) {
    gammaList['packet.ip'] = packet.gamma;
    
    // Calculate average path loss exponent (gamma)
    // based on the gamma calculated at all base stations.
    var g = 0;
    for (var ip in gammaList) {
        if (gammaList.hasOwnProperty(ip)) {
            g += gammaList[ip];
        }
    }
    var length = Object.keys(gammaList).length;
    gammaAverage = g / length;
}

function broadCastPresentBeacons() {
    var presentBeacons = {};
    for (var id in beacons) {
        if (beacons.hasOwnProperty(id)) {
            var nearestBaseStation = getNearest(id);
            if (!nearestBaseStation) {
                continue;
            }
            if (!presentBeacons[nearestBaseStation]) {
                presentBeacons[nearestBaseStation] = [];
            }
            presentBeacons[nearestBaseStation].push(id);
        }
    }
    //console.log(Object.keys(presentBeacons).length);
    ioSocket.sockets.emit('beacon', presentBeacons);
}

function baseStationUpdated(packet) {
    var beacon = packet.beacon;
    beacon.position = packet.position;
    var gamma = 2.0;
    if (gammaList.hasOwnProperty(packet.ip)) {
        gamma = gammaList['packet.ip'];
    }
    var distance = calculateDistance(beacon, 2.2);
    /*var prediction = filters.kalman({
        pageX: 0,
        pageY: distance
    });*/
    beacon.prediction = distance;
    if (!beacons[beacon.id]) {
        beacons[beacon.id] = {};
    }
    beacons[beacon.id][packet.ip] = beacon;

    broadCastPresentBeacons();
    trilaterate();
}

function trilaterate() {
    var bs = {};
    for (var id in beacons) {
        if (beacons.hasOwnProperty(id)) {
            if (Object.keys(beacons[id]).length >= 3) {
                // There are currently only three beacons,
                // so no need to check for more.
                bs[id] = [];
                for (var ip in beacons[id]) {
                    if (beacons[id].hasOwnProperty(ip)) {
                        bs[id].push(beacons[id][ip]);
                    }
                }
            }
        }
    }
    
    // now, each object in bs should be populated with an
    // array of 3 beacons, hence we have enough information to
    // perform the trilateration.
    
    for (var id2 in bs) {
        if (bs.hasOwnProperty(id2)) {
            
            var bs1 = bs[id2][0];
            var bs2 = bs[id2][1];
            var bs3 = bs[id2][2];
            
            var bs1Point = { 
                x: bs1.position.x, 
                y: bs1.position.y, 
                z: 0, 
                r: bs1.prediction 
            };
            var bs2Point = { 
                x: bs2.position.x, 
                y: bs2.position.y, 
                z: 0, r: 
                bs2.prediction
            };
            var bs3Point = { 
                x: bs3.position.x, 
                y: bs3.position.y, 
                z: 0, 
                r: bs3.prediction 
            };
            
            var position = positioning.trilaterate(bs1Point, bs2Point, bs3Point, true);
            
            bs[id2] = position;
            console.log(bs1.prediction, bs2.prediction, bs3.prediction, position.x, position.y);
            
            if (log) {
                data.push({
                   bs1Distance: bs1.prediction,
                   bs2Distance: bs2.prediction,
                   bs3Distance: bs3.prediction,
                   x: position.x,
                   y: position.y
                });
            }
            
        }
    }
}

// Predict the beacons positions by assuming that the base station
// that receives the strongest signal is the closest one.
function getNearest(beaconId) {
    var baseStations = beacons[beaconId];
    // If only one base station is in range of the beacon,
    // return the address of the base station.
    /*if (Object.keys(baseStations).length === 1) {
        return Object.keys(baseStations)[0];
    }*/
    
    // Search for the basestation that is closest to the beacon
    // and return the address of the base station.
    var nearestBaseStation = null;
    var distance = 1000;
    for (var address in baseStations) {
        if (baseStations.hasOwnProperty(address)) {
            if (baseStations[address].prediction < distance) {
                distance = baseStations[address].prediction;
                nearestBaseStation = address;
            }
        }
    }
    return nearestBaseStation;
}

function calculateDistance(beacon, gamma) {
    var pathLoss = beacon.txPower - beacon.rssi;
    var distance = Math.pow(10, (pathLoss / (10 * gamma)) - 2.0);
    return distance;
}
