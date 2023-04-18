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

//for localhost
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "company",
// });

//for cloud
// var con = mysql.createConnection({
//   host: "sql.freedb.tech",
//   user: "freedb_poman",
//   password: "c#3cH$W7pXk3QRk",
//   database: "freedb_drcare_db",
// });

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!!!");
// });

let stop = false;

require("dns").lookup(require("os").hostname(), function (err, add, fam) {
  console.log("server addr: " + add);
});

var warning = "";

io.on("connection", function (socket) {
  console.log("user connected: " + socket.id);
  stop = false;

  function sendTest(count) {
    console.log("emit message test to client");
    const msg = "test" + count;
    socket.emit("send", msg);
  }

  socket.on("mpu", (data) => {
    console.log("mpu data", data)
  })
  // // if (!stop) {
  // //   setInterval(()=>{
  // //     const xyz = `${Math.random()},${Math.random()},${Math.random()}`
  // //     io.emit('chart', xyz)
  // //     console.log('sending data', xyz)
  // //   },250);
  // // }

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

  const dataArray = [];

  socket.on("message", function (msg) {
    //console.log("message: "+ msg);
    io.emit("send", msg);
    var raw = msg.split(",");
    dataArray.push(raw);
    console.log('Array length:', dataArray.length);
    if ((raw[1] < 0)) {
      warning = "Unsafe";
      console.log(warning);
      console.log('object', msg);
    } else {
      warning = "safe";
    }
    console.log(warning);
    if(dataArray.length % 30 == 0) {
      var sql = `INSERT INTO giatoc (pitch_value, roll_value, warning) VALUES (${raw[1]},${raw[0]}, '${warning}')`;
      con.query(sql, function (err, results) {
        if (err) throw err;
        console.log("Data inserted at:", new Date());
      });
    }
    //console.log(warning);
    // function insertData() {
    //   var value = msg;
    //   var raw = msg.split(",");
    //   //console.log('object', msg);
    //   if ((raw[1] < -110 && raw[0] < -30) || (raw[1] > 170 && raw[0] > 0)) {
    //     warning = "Unsafe";
    //     console.log(warning);
    //     console.log('object', msg);
    //   } else {
    //     warning = "safe";
    //   }
    //   if(dataArray.length % 10 == 0) {
    //     var sql = `INSERT INTO giatoc (pitch_value, roll_value, warning) VALUES (${raw[1]},${raw[0]}, '${warning}')`;
    //     con.query(sql, function (err, results) {
    //       if (err) throw err;
    //       console.log("Data inserted at:", new Date());
    //     });
    //   }
    //   //var sql =  "INSERT INTO giatoc (value, warning) VALUES ('Company Inc', 'Highway 37')";
    //   // con.query(sql, function (err, results) {
    //   //   if (err) throw err;
    //   //   console.log("Data inserted at:", new Date());
    //   // });
    // }

    //setInterval(insertData, 1000);
    getValueXY(msg);
  });

  socket.on("warning", function (msg) {
    //console.log("message: " + msg);
    getValueWarning(msg);
    io.emit("warning", msg);
    //io.emit("send", msg);
  });

  socket.on("emg", (emg) => {
    console.log("emg: ", emg);
    socket.broadcast.emit("chart_emg", emg);
  });

  socket.on("heart", (emg) => {
    console.log("heart: ", emg);
    socket.broadcast.emit("chart_heart", emg);
  });

  // const sender = (value) => {
  //   value = socket.on("message", msg);
  //   io.emit("text", value);
  // };

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
