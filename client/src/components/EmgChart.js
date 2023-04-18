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

export default function EmgChart({socket}) {
    const initValue = [
        "0","0","0","0", "0","0","0","0", "0","0","0","0", "0","0","0","0", "0","0","0","0", "0","0", "0","0","0","0", "0","0","0","0", "0","0","0","0", "0","0", "0","0","0","0", "0","0","0","0", "0","0"
    ]
    const [value, setValue] = useState(initValue);

    const convertData = () => {
        //console.log(value)
        const converted = value.map((data, index) => {
         
          return ({'key': index, 'emg': data})
        })
        
        return converted
      }

    useEffect(() => {
    
        socket.on('chart_emg', (val) => {
          
          setValue(prev => {
            prev.shift()
            return [...prev, val]})
          
        })
        
      }, [])

    return(
        <div className="emg-chart">
            <LineChart
                style={{margin: "40px"}}
                width={1200}
                height={500}
                data={convertData()}
                margin={{
                    top: 5,
                
                    left: 20,

                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis/>
                <YAxis domain={[0, 50000]}/>
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="emg"
                    stroke="#8884d8"
                    
                    isAnimationActive={false}
                />
                
                </LineChart>
        </div>
    )
}