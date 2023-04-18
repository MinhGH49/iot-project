// import logo from "./logo.svg";
import "../App.css";
import socketIO from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  ResponsiveContainer,
  Label,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Row, Container, Table } from "react-bootstrap";
import EmgChart from "../components/EmgChart";

const socket = socketIO.connect("http://localhost:5000");

function SensorDataChart() {
  const initValue = [
    "0,0,0",
    "0,0,0",
    "0,0,0",
    "0,0,0",
    "0,0,0",
    "0,0,0",
    "0,0,0",
    "0,0,0",
    "0,0,0",
    "0,0,0",
  ];
  const [value, setValue] = useState(initValue);
  const [x, setX] = useState(" ");
  const [warning, setWarning] = useState(" ");

  const [minPitch, setMinPitch] = useState(0);
  const [maxPitch, setMaxPitch] = useState(0);
  const [minRoll, setMinRoll] = useState(0);
  const [maxRoll, setMaxRoll] = useState(0);

  const handleSetValues = () => {
    console.log("object", { minPitch, maxPitch, minRoll, maxRoll });
    socket.emit("set-values", { minPitch, maxPitch, minRoll, maxRoll });
  };

  const convertData = () => {
    console.log(value);
    const converted = value.map((data, index) => {
      //console.log(data)
      const splited = data.split(",");
      return { key: index, x: splited[0], y: splited[1], z: splited[2] };
    });
    //console.log('converted to ', converted)

    return converted;
  };
  //const socketRef = useRef();
  useEffect(() => {
    socket.on("send", (val) => {
      let valueX = val.split(",");
      setX(valueX);
      setValue((prev) => {
        prev.shift();
        return [...prev, val];
      });
    });

    socket.on("warning", (val) => {
      setWarning(val);
    });
  }, []);
  // console.log(socket.on("connect", socket.connected));

  return (
    <div className="App">
      <Container className="p-3">
        <Row className="justify-content-md-center">
          <h1 className="header" style={{ textAlign: "center" }}>
            Real time IOT Sensor Data
          </h1>
        </Row>
        <Row className="">
          <div style={{ width: 600, height: 400 }}>
            <ResponsiveContainer>
              <LineChart
                style={{ margin: "20px" }}
                width={600}
                height={400}
                data={convertData()}
                margin={{
                  top: 5,

                  left: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="key"
                  // label={{
                  //   value: "Number of sampling times",
                  //   position: "insideBottom",
                  //   offset: -0,
                  // }}
                  tick={{
                    fontSize: 12,
                    fill: "#999",
                    transform: "translate(0, 5)",
                    interval: 0, // display every tick
                    angle: -20, // rotate the tick label by -30 degrees
                  }}
                />

                {/* y: roll, x: pitch */}
                <YAxis
                  domain={[-300, 350]}
                  ticks={[-300, -200, -100, 0, 100, 200, 300]}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="x"
                  stroke="#8884d8"
                  name="pitch"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#8fce00"
                  name="roll"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ width: 600, height: 400 }}>
            <ResponsiveContainer>
              <Table style={{ width: "200px", marginLeft: "200px" }}>
                <thead>
                  <tr>
                    <th>Roll</th>
                    <th>Pitch</th>
                    <th style={{ color: "red" }}>Warning:</th>
                    <th>Config</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{x[0]}</td>
                    <td>{x[1]}</td>
                    <td>{warning}</td>
                    <td>
                      <div style={{marginRight: "40px"}}>
                        <label>Min Pitch:</label>
                        <input
                          type="number"
                          value={minPitch}
                          onChange={(e) =>
                            setMinPitch(parseInt(e.target.value))
                          }
                        />
                        <br />
                        <label>Max Pitch:</label>
                        <input
                          type="number"
                          value={maxPitch}
                          onChange={(e) =>
                            setMaxPitch(parseInt(e.target.value))
                          }
                        />
                        <br />
                        <label>Min Roll:</label>
                        <input
                          type="number"
                          value={minRoll}
                          onChange={(e) => setMinRoll(parseInt(e.target.value))}
                        />
                        <br />
                        <label>Max Roll:</label>
                        <input
                          type="number"
                          value={maxRoll}
                          onChange={(e) => setMaxRoll(parseInt(e.target.value))}
                        />
                        <br />
                        <button onClick={handleSetValues}>Set Values</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </ResponsiveContainer>
          </div>
        </Row>
        <Row>
          <ResponsiveContainer>
            <EmgChart socket={socket} />
          </ResponsiveContainer>
        </Row>
      </Container>
    </div>
  );
}

export default SensorDataChart;
