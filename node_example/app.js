var express = require('express'),
http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

port = process.env.PORT || 3000;
server.listen(port);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var usernames = {};
// After any socket connects, SEND it a custom 'news' event
io.sockets.on('connection', function (socket) {
     
      socket.on('addUser', function (username)
      {
        socket.username = username;
        usernames[username] = username;

        io.sockets.emit("connected", username)
      });

      socket.on('addMessage', function (message)
      {
        io.sockets.emit('updateChat', "<strong>"+socket.username+ ":</strong> "+ message);
      });
    });