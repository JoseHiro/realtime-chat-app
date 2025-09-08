import React from "react";

export const TimeStamp = ({ time }: { time: string }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return <p className="text-xs text-gray-400 mt-2 px-4">{formatTime(time)}</p>;
};
