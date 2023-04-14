import logo from './logo.svg';
import './App.css';
import socketIO   from "socket.io-client";
import { useState, useEffect, useRef } from 'react';


const socket = socketIO.connect('http://localhost:5000')


function App() {

  const [value, setValue] = useState();
  
  //const socketRef = useRef();
  useEffect(() => {
    socket.on('send', (val) => {
      setValue(val)
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
   
    
  }, [socket])
  // console.log(socket.on("connect", socket.connected));
  return (
    <div className="App">
      <h1>test client{value}</h1>
    </div>
  );
}

export default App;
