import React from "react";

export const TimeStamp = ({ time }: { time: string }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <p className="text-xs text-gray-400 mt-1.5 px-1 font-medium">
      {formatTime(time)}
    </p>
  );
};
