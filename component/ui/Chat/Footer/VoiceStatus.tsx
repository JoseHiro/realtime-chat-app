import React from "react";

interface VoiceStatusProps {
  micLevel?: number;
  isReconnecting?: boolean;
}

const BAR_COUNT = 5;

export const VoiceStatus = ({ micLevel = 0, isReconnecting = false }: VoiceStatusProps) => {
  if (isReconnecting) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        再接続中…
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Mic level bars */}
      <div className="flex items-end gap-[3px] h-5">
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const threshold = (i + 1) / BAR_COUNT;
          const active = micLevel >= threshold;
          return (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-75 ${
                active ? "bg-gray-700 dark:bg-gray-300" : "bg-gray-200 dark:bg-gray-700"
              }`}
              style={{ height: `${40 + i * 15}%` }}
            />
          );
        })}
      </div>
      <p className="text-xs text-gray-400">
        {micLevel > 0.05 ? "聞こえています" : "話してください"}
      </p>
    </div>
  );
};
