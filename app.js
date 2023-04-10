// express framework for a basic http server
var app = require('express')();
// create the http server
var server = require('http').Server(app);
server.listen(3000);
var path = require('path')
var io = require('socket.io')(server);
var middleware = require('socketio-wildcard')();
io.use(middleware);



require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('server addr: '+add);
      })    



io.on('connection', function (socket) {

    console.log('user connected: ' + socket.id);
  
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on("message", function (msg) {
     console.log("message: "+ msg);
    });

    // socket.on('*', function (eventName)  {
    //     console.log("event name: " + eventName)
        
    // } )
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
  });

