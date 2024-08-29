import React from "react";
import { useTimer } from 'react-timer-hook';

function Timer({ expiryTimestamp, onExpire }) {
  const {
    seconds,
    minutes,
    hours,
    days,
  } = useTimer({
    expiryTimestamp,
    onExpire,
  });

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "30px" }}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
        <span>{seconds}</span>
      </div>
    </div>
  );
}

export default Timer;
