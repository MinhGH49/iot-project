// express framework for a basic http server
const PORT = 5000;
var app = require('express')();
// create the http server
var server = require('http').Server(app);
const cors = require('cors')
app.use(cors());


var path = require('path')
var io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});
// var io = require('socket.io')(server)



var middleware = require('socketio-wildcard')();
io.use(middleware);

let i = 0;

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('server addr: '+add);
      })    



io.on('connection', function (socket) {

    console.log('user connected: ' + socket.id);

    function sendTest(count) {
      console.log('emit message test to client');
            const msg = 'test' + count
            socket.emit('send', msg)
    }

    setInterval(()=>{
      io.emit('chart', Math.random())
      console.log('sending data')
    },200);
    // setInterval(sendTest, 250, i)

    

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    socket.on("message", function (msg) {
     console.log("message: "+ msg);
     io.emit("send", msg);
    });

    const sender = (value) => {
      value = socket.on("message",msg);
      io.emit("text", value)
    }


    

    // socket.on('*', function (eventName)  {
    //     console.log("event name: " + eventName)
        
    // } )
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
  });

  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });