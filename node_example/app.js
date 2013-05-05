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

        io.sockets.emit("connected", username);
        io.sockets.emit("userList", usernames);
      });

      socket.on('addMessage', function (message)
      {
        io.sockets.emit('updateChat', 
          "<p style='line-height: 1.6em; font-size:16px; margin-top: 2px; margin-left:6px; margin-botton:0px;'><strong style=' text-shadow: 2px 2px 2px #AEB9BD;'>"+
          socket.username+ ": </strong>"+ message+"</p>");
      });

      // when the user disconnects.. perform this
      socket.on('disconnect', function(){
          // remove the username from global usernames list
          delete usernames[socket.username];
          // update list of users in chat, client-side
          io.sockets.emit('userList', usernames);
          // echo globally that this client has left
          socket.broadcast.emit('disconnected',  socket.username);
      });
    });