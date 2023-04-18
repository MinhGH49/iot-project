import socketIO from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import {
  ResponsiveContainer,
} from "recharts";

import { Row, Container, Table } from "react-bootstrap";

export default function HeartBeat({ socket }) {
  const initValue = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ];
  const [value, setValue] = useState(["0"]);

  const convertData = () => {
    //console.log(value)
    const converted = value.map((data, index) => {
      return { key: index, emg: data };
    });

    return converted;
  };

  useEffect(() => {
    socket.on("chart_heart", (val) => {
      val = val.split(',')[0]
      setValue((prev) => {
        prev.shift();
        return [...prev, val];
      });
    });
  }, []);

  return (
    <div style={{ width: 100, height: 400 }}>
      <ResponsiveContainer>
        <Table style={{ width: "100px", marginLeft: "0px" }}>
          <thead>
            <tr>
              <th>Heartbeat</th>
              <th>Sp02</th>
              <th style={{ color: "red" }}>Diagnose:</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{value}</td>
              <td>{}</td>
              <td>{}</td>
            </tr>
          </tbody>
        </Table>
      </ResponsiveContainer>
    </div>
  );
}
