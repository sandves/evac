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

EddystoneBeaconScanner.on('found', function(beacon) {
    io.sockets.emit('beacon-updated', {
        rssi: beacon.rssi,
        distance: beacon.distance
    });
    console.log(beacon.distance + ' (' + beacon.rssi + ')');
  //console.log('found Eddystone Beacon:\n', JSON.stringify(beacon, null, 2));
});

EddystoneBeaconScanner.on('updated', function(beacon) {
    io.sockets.emit('beacon-updated', {
        rssi: beacon.rssi,
        distance: beacon.distance
    });
    console.log(beacon.distance + ' (' + beacon.rssi + ')');
  //console.log('updated Eddystone Beacon:\n', JSON.stringify(beacon, null, 2));
});

EddystoneBeaconScanner.on('lost', function(beacon) {
    io.sockets.emit('beacon-updated', {
        rssi: beacon.rssi,
        distance: beacon.distance
    });
    console.log(beacon.distance + ' (' + beacon.rssi + ')');
  //console.log('lost Eddystone beacon:\n', JSON.stringify(beacon, null, 2));
});

EddystoneBeaconScanner.startScanning(true);