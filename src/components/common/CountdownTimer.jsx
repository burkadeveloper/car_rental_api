import React, { useState, useEffect } from "react";
import {
  differenceInSeconds,
  formatDuration,
  intervalToDuration,
} from "date-fns";

const CountdownTimer = ({ targetDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = differenceInSeconds(new Date(targetDate), now);
      if (diff <= 0) {
        setTimeLeft("Expired");
        if (onExpire) onExpire();
        clearInterval(interval);
      } else {
        const duration = intervalToDuration({
          start: now,
          end: new Date(targetDate),
        });
        const parts = [];
        if (duration.days) parts.push(`${duration.days}d`);
        if (duration.hours) parts.push(`${duration.hours}h`);
        if (duration.minutes) parts.push(`${duration.minutes}m`);
        if (duration.seconds) parts.push(`${duration.seconds}s`);
        setTimeLeft(parts.join(" "));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  return <span className="font-mono">{timeLeft}</span>;
};

export default CountdownTimer;
