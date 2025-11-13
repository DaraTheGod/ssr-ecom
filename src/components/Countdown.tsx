// src/components/Countdown.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";

interface Props {
  initialSeconds?: number;
  onExpire?: ReactNode;          // render when timer hits 0
}

export default function Countdown({ initialSeconds = 30, onExpire }: Props) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setExpired(false);

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setExpired(true);
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [initialSeconds]);

  // When expired we **hide the timer** and show the button (passed via onExpire)
  if (expired && onExpire) return <>{onExpire}</>;

  return (
    <p className="text-center text-sm font-medium font-khmer-toch text-gray-600">
      នៅសល់ {timeLeft} វិនាទី
    </p>
  );
}