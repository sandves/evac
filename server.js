var EddystoneBeaconScanner = require('eddystone-beacon-scanner');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

/*var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream('beacon_data' + '/debug.dat', {flags : 'w'});
*/

server.listen(3000);


io.on('connection', function(socket) {
    console.log('client connected');
    socket.emit('connected', {hello: 'world'});
    socket.on('bar', function(data) {
        console.log(data);
    });
});


/*EddystoneBeaconScanner.on('found', function(beacon) {
    console.log('found beacon');
});

EddystoneBeaconScanner.on('updated', function(beacon) {
    if (typeof beacon.distance != 'undefined') {
        io.sockets.emit('beacon-updated', beacon);
        console.log(beacon.distance + ' (' + beacon.rssi + ')');
        // log_file.write(util.format(beacon.distance) + '\n');
    }
    else
        console.log(beacon);
});

EddystoneBeaconScanner.on('lost', function(beacon) {
    console.log('lost beacon');    
});

EddystoneBeaconScanner.startScanning(true);*/

var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('beacon_data/debug.dat');

lr.on('error', function (err) {
    console.log(err);
});

function line(l) {
    // pause emitting of lines...
    lr.pause();

    // ...do your asynchronous line processing..
    setTimeout(function () {

        var line = parseFloat(l);

        var e = {
            pageX: 0,
            pageY: line
        };

        var d = kalman(e);
        console.log(d.y + ' : ' + line);

        var beacon = {
            rssi: 0,
            txPower: 0,
            url: 'www.vg.no',
            distance: line,
            prediction: d.y
        };

        io.sockets.emit('beacon-updated', beacon);

        lr.resume();
    }, 500);
}
 
lr.on('line', line);

lr.on('end', function () {
    // All lines are read, file is closed now.
    console.log('all lines are read');
});

var sylvester = require('sylvester');
Matrix = sylvester.Matrix;

// Settings //////////////////////////////////////

// The decay errodes the assumption that velocity 
// never changes.  This is the only unique addition
// I made to the proceedure.  If you set it to zero, 
// the filter will act just like the one we designed
// in class which means it strives to find a consitent
// velocitiy.  Over time this will cause it to assume
// the mouse is moving very slowly with lots of noise.
// Set too high and the predicted fit will mirror the 
// noisy data it recieves.  When at a nice setting, 
// the fit will be resposive and will do a nice job
// of smoothing out the function noise.

var decay = 0.0001;

// I use the uncertainty matrix, R to add random noise
// to the known position of the mouse.  The higher the
// values, the more noise, which can be seen by the 
// spread of the orange points on the canvas.
//
// If you adjust this number you will often need to 
// compensate by changing the decay so that the prediction
// function remains smooth and reasonable.  However, as
// these measurements get noisier we are left with a 
// choice between slower tracking (due to uncertainty)
// and unrealistic tracking because the data is too noisy.

var R = Matrix.Diagonal([0.02, 0.02]);
    
// initial state (location and velocity)
// I haven't found much reason to play with these
// in general the model will update pretty quickly 
// to any entry point.

var x = $M([
    [0], 
    [0], 
    [0], 
    [0] 
]);

// external motion
// I have not played with this at all, just
// added like a udacity zombie.

var u = $M([
    [0], 
    [0], 
    [0], 
    [0]
]);
        
// initial uncertainty 
// I don't see any reason to play with this
// like the entry point it quickly adjusts 
// itself to the behavior of the mouse
var P = Matrix.Random(4, 4);

// measurement function (4D -> 2D)
// This one has to be this way to make things run
var H = $M([
    [1, 0, 0, 0], 
    [0, 1, 0, 0]
]); 

// identity matrix
var I = Matrix.I(4);

// To determine dt
var time = (new Date).getTime();


// Event Loop //////////////////////////////////////

function kalman(e) {

    // change in time
    now = (new Date).getTime();
    dt = now - time;
    time = now;

    // Derive the next state
    F = $M([[1, 0, dt, 0], 
            [0, 1, 0, dt], 
            [0, 0, 1, 0], 
            [0, 0, 0, 1]
           ]); 
   
    // decay confidence
    // to account for change in velocity
    P = P.map(function(x) {
        return x * (1 + decay * dt);
    });
    
    // Fake uncertaintity in our measurements
    xMeasure = e.pageX; // + 500 * R.e(1,1) * 2 * (Math.random() - 0.5);
    yMeasure = e.pageY;// + 500 * R.e(2,2) * 2 * (Math.random() - 0.5);
    
    // prediction
    x = F.x(x).add(u);
    P = F.x(P).x(F.transpose());

    // measurement update
    Z = $M([[xMeasure, yMeasure]]);
    y = Z.transpose().subtract(H.x(x));
    S = H.x(P).x(H.transpose()).add(R);

    K = P.x(H.transpose()).x(S.inverse());
    x = x.add(K.x(y));
    P = I.subtract(K.x(H)).x(P);
    
    var prediction = {
        x: x.e(1, 1),
        y: x.e(2, 1)
    };

    return prediction;

}