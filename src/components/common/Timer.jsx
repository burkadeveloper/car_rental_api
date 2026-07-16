import React, { useState, useEffect } from "react";

const Timer = ({ targetTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = targetTime - Date.now();
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime, onExpire]);

  if (timeLeft <= 0) return <span className="text-red-500">Expired</span>;
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  return <span>{`${hours}h ${minutes}m ${seconds}s`}</span>;
};

export default Timer;
