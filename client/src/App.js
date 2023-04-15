import logo from './logo.svg';
import './App.css';
import socketIO   from "socket.io-client";
import { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const socket = socketIO.connect('http://localhost:5000')


function App() {
  const initValue = [0]
  const [value, setValue] = useState(initValue);

  const convertData = () => {
    const converted = value.map((data, index) => ({'key': index, 'x': data}))
    console.log('converted to ', converted)
    return converted
  }
  //const socketRef = useRef();
  useEffect(() => {
    socket.on('chart', (val) => {

      setValue(prev => {
        if (prev.length >=  10) {
          return [...prev.slice(1), val]
        } else {
          return [...prev, val]
        }
      })

        
      //console.log(value)
      
    })
    // socket.on('connect', ()=> {
    //   console.log('connected to server', socket.id)
     
    // })
    // socket.on("connect_error", () => {
    //   console.log('connect fail')
    // });
    // socket.on("send", (data) => {
    //   console.log('received msg: ', data)
    // })
   
    
  }, [])
  // console.log(socket.on("connect", socket.connected));
  return (
    <div className="App">
      
      <LineChart
      width={500}
      height={500}
      data={convertData()}
      margin={{
        top: 5,
    
        left: 20,

      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="key" />
      <YAxis/>
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="x"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
        isAnimationActive={false}
      />
     
    </LineChart>
    </div>
  );
}

export default App;
