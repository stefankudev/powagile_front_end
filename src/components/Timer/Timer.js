import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function Timer() {
  const [counter, setCounter] = useState(20);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);
  console.log(counter);

  function stopTimer() {
    setIsClicked(false);
    setCounter(20);
  }

  return (
    <div>
      <div>
        <button onClick={() => setIsClicked(!isClicked)}>
          {isClicked ? "Stop" : "Start"}
        </button>
        <button onClick={stopTimer}>Reset</button>
      </div>
      <CountdownCircleTimer
        isPlaying
        duration={counter}
        colors={[
          ["#004777", 0.33],
          ["#F7B801", 0.33],
          ["#A30000", 0.33],
        ]}
      >
        {({ remainingTime }) => counter}
      </CountdownCircleTimer>
    </div>
  );
}
