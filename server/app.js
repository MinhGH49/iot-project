// express framework for a basic http server
const PORT = 5000;
var app = require("express")();
// create the http server
var server = require("http").Server(app);
var mysql = require("mysql");
const cors = require("cors");
app.use(cors());

var path = require("path");
var io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
// var io = require('socket.io')(server)

var middleware = require("socketio-wildcard")();
io.use(middleware);

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "company",
});

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!!!");
// });

let stop = false;

require("dns").lookup(require("os").hostname(), function (err, add, fam) {
  console.log("server addr: " + add);
});

io.on("connection", function (socket) {
  console.log("user connected: " + socket.id);
  stop = false;

  function sendTest(count) {
    console.log("emit message test to client");
    const msg = "test" + count;
    socket.emit("send", msg);
  }
  // if (!stop) {
  //   setInterval(()=>{
  //     const xyz = `${Math.random()},${Math.random()},${Math.random()}`
  //     io.emit('chart', xyz)
  //     console.log('sending data', xyz)
  //   },250);
  // }

  // setInterval(sendTest, 250, i)

  socket.on("disconnect", function () {
    console.log("user disconnected");
    stop = true;
  });
  const getValueXY = (value) => {
    return value;
  };
  const getValueWarning = (value) => {
    return value;
  };

  socket.on("message", function (msg) {
    //console.log("message: "+ msg);
    io.emit("send", msg);
    function insertData() {
      var value = msg;
      let warning = "";
      var raw = msg.split(",");
      if (raw[1] < 0) {
        warning = "Unsafe";
      } else {
        warning = "safe";
      }
      var sql = `INSERT INTO giatoc (pitch_value, roll_value, warning) VALUES (${raw[1]},${raw[0]}, '${warning}')`;
      //var sql =  "INSERT INTO giatoc (value, warning) VALUES ('Company Inc', 'Highway 37')";
      con.query(sql, function (err, results) {
        if (err) throw err;
        console.log("Data inserted at:", new Date());
      });
    }
    setInterval(insertData, 400);
    getValueXY(msg);
  });

  socket.on("warning", function (msg) {
    console.log("message: " + msg);
    getValueWarning(msg);
    io.emit("warning", msg);
    //io.emit("send", msg);
  });

  const sender = (value) => {
    value = socket.on("message", msg);
    io.emit("text", value);
  };

  // define a function to insert data into the database

  // call insertData function every 5 minutes (300000 ms)

  // socket.on('*', function (eventName)  {
  //     console.log("event name: " + eventName)

  // } )
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
