import React, { useState, useRef, useEffect } from 'react';

import './App.css';
import axios from "axios";

function App() {
  const Ref = useRef(null);
  const [timerTotalSecond,setTimerTotalSecond] = useState(36000);
  const [timer, setTimer] = useState();
  const [bitcoins, setBitcoin] = useState();
  const [editableStatus, setEditableStatus] = useState(false);
  const [second, setSecond] = useState();
  const [minute, setMinute] = useState();
  const [hour, setHour] = useState();

  const getData = async () => {
    const { data } = await axios("https://api.coindesk.com/v1/bpi/currentprice.json");

    setBitcoin(data);
  };

  
const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
        total, hours, minutes, seconds
    };
}
    
const startTimer = (e) => {
  let { total, hours, minutes, seconds } 
              = getTimeRemaining(e);
  if (total >= 0) {
      setTimer(
          (hours > 9 ? hours : '0' + hours) + ':' +
          (minutes > 9 ? minutes : '0' + minutes) + ':'
          + (seconds > 9 ? seconds : '0' + seconds)
      )
  }
}

const clearTimer = (e) => {
  console.log(Ref.current)
  if (Ref.current) clearInterval(Ref.current);
  const id = setInterval(() => {
      startTimer(e);
  }, 1000)
  Ref.current = id;
}

const increment = (type) =>{
  setTimerTotalSecond(timerTotalSecond + 3600)
}

const decrease = (type) =>{
  setTimerTotalSecond(timerTotalSecond - 3600)
}

const decreaseMinute = (type) =>{
  setTimerTotalSecond(timerTotalSecond - 60)
}

const getDeadTime = () => {
  let deadline = new Date();

  deadline.setSeconds(deadline.getSeconds() + timerTotalSecond);
  return deadline;
}

const timerExplode = (e) => {
  if(timer === undefined){ return }
    if (Ref.current) clearInterval(Ref.current);
    console.log(timer)
    const timerSplit = timer.split(":");
    setSecond(timerSplit[2])
    setMinute(timerSplit[1])
    setHour(timerSplit[0])
}
const editableTimer = () => {
  setEditableStatus(true);
  timerExplode();
}
useEffect(() => {
  if(editableStatus){
    timerExplode()
  }
});


useEffect(() => {
  clearTimer(getDeadTime());
  getData();
}, []);

useEffect(() => {
  clearTimer(getDeadTime());
  setTimer(timer);
  console.log(timer)
}, [timerTotalSecond]);

  return (
    <div className="App">
     
      {editableStatus ? (<div className="editableTimer">
        <div className='item hour'>
          <button className='increment' onClick={() => increment('hour')}>+</button>
          {hour}
          <button className="decrease" onClick={() => decrease('hour')}>-</button>
        </div>
        <div className='item minute'>
          <button className='increment' >+</button>
          {minute}
          <button className="decrease" onClick={() => decreaseMinute('minute')}>-</button>
          </div>
        <div className='item second'><button className='increment'>+</button>{second}<button className="decrease">-</button></div>
      </div>) : (
         <h2>{timer}</h2>
      )   
      }
    
            <button onClick={() => editableTimer()}>Düzenle</button>
            <br/><br/>
            <hr/>
            <br/>

      <h2>Bitcoin</h2> 
   
      {bitcoins !== undefined &&  <div>
      <p>{bitcoins.bpi.EUR.code } : {bitcoins.bpi.EUR.rate } € </p>
      <p>{bitcoins.bpi.GBP.code } : {bitcoins.bpi.GBP.rate } £ </p>
      <p>{bitcoins.bpi.USD.code } : {bitcoins.bpi.USD.rate } $ </p>
        
      </div>}

    
    </div>
  );
}

export default App;
