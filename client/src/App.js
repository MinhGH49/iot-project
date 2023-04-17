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
  const initValue = [
    "0,0,0","0,0,0","0,0,0","0,0,0","0,0,0","0,0,0","0,0,0","0,0,0","0,0,0","0,0,0"
  ]
  const [value, setValue] = useState(initValue);

  const convertData = () => {
    console.log(value)
    const converted = value.map((data, index) => {
      //console.log(data)
      const splited = data.split(',')
      return ({'key': index, 'x': splited[0], 'y': splited[1], 'z': splited[2]})
    })
    //console.log('converted to ', converted)
    
    return converted
  }
  //const socketRef = useRef();
  useEffect(() => {
    
    socket.on('send', (val) => {
      
      setValue(prev => {
        prev.shift()
        return [...prev, val]})
      
    })
    
  }, [])
  // console.log(socket.on("connect", socket.connected));
  
  return (
    <div className="App">
      
      <h1>Hello </h1>
      <LineChart
      style={{margin: "40px"}}
      width={1000}
      height={500}
      data={convertData()}
      margin={{
        top: 5,
    
        left: 20,

      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis/>
      <YAxis domain={[0, 'dataMax + 100']}/>
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="x"
        stroke="#8884d8"
        
        isAnimationActive={false}
      />
       <Line
        type="monotone"
        dataKey="y"
        stroke="#8fce00"
        
        isAnimationActive={false}
      />
       <Line
        type="monotone"
        dataKey="z"
        stroke="#ad1f1f"
        
        isAnimationActive={false}
      />
     
    </LineChart>
    </div>
  );
}

export default App;
