import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export const StopWatch = () => {
  const [timeLeft, setTimeLeft] = useState(1 * 30);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            // 時間切れ時の処理（自動で会話終了）
            // setOverlayOpened(true);
            // handleCreateSummary();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 60) return "text-red-500";
    if (timeLeft <= 120) return "text-orange-500";
    return "text-green-600";
  };

  const getTimerBgColor = () => {
    if (timeLeft <= 60) return "bg-red-50 border-red-200";
    if (timeLeft <= 120) return "bg-orange-50 border-orange-200";
    return "bg-green-50 border-green-200";
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getTimerBgColor()}`}
    >
      <Clock className={`w-4 h-4 ${getTimerColor()}`} />
      <span className={`font-mono text-sm font-semibold ${getTimerColor()}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};
