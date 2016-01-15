var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

app.get('/', function(req, res) {
    console.log('get request');
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', function(socket){
    console.log('client connected');
    socket.emit('foo', {hello: 'world'});
    socket.on('bar', function(data) {
        console.log(data);
    });
});
