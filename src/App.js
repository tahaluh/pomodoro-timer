import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [sessionTime, setSessionTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [time, setTime] = useState({
    paused: true,
    state: "Session",
    minutes: 25,
    seconds: 0,
  });

  const playBeep = () => {
    document.getElementById('beep').play()
  };

  const timeUpdate = () => {
    if (time.paused || (time.seconds == 0 && time.minutes == 0)) {
      setTime((prevValue) => ({
        ...prevValue,
        minutes: prevValue.state == "Session" ? sessionTime : breakTime,
        seconds: 0,
      }));
    }
  };

  const unPause = () => {
    setTime((prevValue) => ({
      ...prevValue,
      paused: !prevValue.paused,
    }));
  };

  async function resetTimer() {
    if (!time.paused) {
      unPause();
    }
    await new Promise((r) => setTimeout(r, 1000));
    setSessionTime(25);
    setBreakTime(5);
    setTime({
      paused: true,
      state: "Session",
      minutes: 25,
      seconds: 0,
    });
  }

  useEffect(timeUpdate, [sessionTime, breakTime]);

  useEffect(() => {
    if (!time.paused) {
      let countDown = setInterval(() => {
        clearInterval(countDown);
        if (time.seconds > 0) {
          // ainda tem segundo?
          setTime((prevValue) => ({
            ...prevValue,
            seconds: prevValue.seconds - 1,
          }));
        } else if (time.minutes > 0) {
          // ainda tem minuto?
          setTime((prevValue) => ({
            ...prevValue,
            minutes: prevValue.minutes - 1,
            seconds: 59,
          }));
        } else {
          // então acabou né
          playBeep();
          setTime((preValue) => ({
            ...preValue,
            state: preValue.state == "Session" ? "Break" : "Session",
          }));
          unPause();
          timeUpdate();
          unPause();
        }
      }, 1000);
    }
  }, [time]);

  const Timer = (props) => {
    return (
      <div className="Timer--Div">
        <h3 className="TimerState">{props.timeLeft.state}</h3>
        <div className="TimeLeft">
          {props.timeLeft.minutes <= 9 && "0"}
          {props.timeLeft.minutes + ":"}
          {props.timeLeft.seconds <= 9 && "0"}
          {props.timeLeft.seconds}
        </div>
      </div>
    );
  };

  const LenghtButtons = (props) => {
    return (
      <div>
        <h3 className="ButtonTitle">{props.titulo}</h3>
        <div className="LenghtButtons--Div">
          <button
            className="LengthButtonUp"
            onClick={() => {
              props.setTime(props.time + 1);
            }}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
          <p className="LengthViewer">{props.time} </p>
          <button
            className="LengthButtonDown"
            onClick={() => {
              props.setTime(props.time > 1 ? props.time - 1 : 1);
            }}
          >
            <i className="fa-solid fa-arrow-down"></i>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <h1 className="Tittle">Pomodoro Timer</h1>
      <div className="LengthControl--Div">
        <LenghtButtons
          titulo={"Break Length"}
          time={breakTime}
          setTime={setBreakTime}
        ></LenghtButtons>
        <LenghtButtons
          titulo={"Session Length"}
          time={sessionTime}
          setTime={setSessionTime}
        ></LenghtButtons>
      </div>
      <Timer timeLeft={time}></Timer>
      <div className="Controls--Div">
        <button onClick={unPause}>
          <i className="fa-solid fa-play"></i>
          <i className="fa-solid fa-pause"></i>
        </button>
        <button
          onClick={() => {
            resetTimer();
          }}
        >
          <i className="fa-solid fa-rotate-left"></i>
        </button>
      </div>
      <audio
          id="beep"
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
    </div>
  );
}

export default App;
