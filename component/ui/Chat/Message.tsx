import { Bot, User, Play, Pause, MessageSquare, Volume2 } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

export const AssistantMessageBox = ({
  text,
  reading,
  displayMode,
  currentPlayingId,
  setCurrentPlayingId,
  audioList,
  id,
}: {
  text: string;
  reading: string;
  displayMode?: string;
  currentPlayingId?: number | null;
  setCurrentPlayingId?: (value: number | null) => void;
  audioList?: any;
  id: number;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAudio = (id: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(audioList[id - 1]);
    audioRef.current = audio;
    audio.play();
    setCurrentPlayingId(id);

    audio.onended = () => {
      setCurrentPlayingId(null);
      audioRef.current = null;
    };
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentPlayingId(null);
      audioRef.current = null;
    }
  };

  return (
    <div
      style={{ animationDelay: `${id * 0.5}s` }}
      className="animate-float p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md bg-white text-gray-900 border border-gray-200"
    >
      {displayMode === "audio" ? (
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentPlayingId === id + 1) {
                stopAudio();
              } else {
                playAudio(id + 1);
              }
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 shadow-sm"
          >
            {currentPlayingId === id + 1 ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      currentPlayingId === id + 1
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-emerald-300"
                    }`}
                    style={{
                      height: `${Math.random() * 12 + 4}px`,
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 ">
              {currentPlayingId === id + 1 ? "Playing..." : "Audio Message"}
            </p>
          </div>
        </div>
      ) : (
        <div className=" border-gray-100">
          <p className="text-sm lg:text-base leading-relaxed">{text}</p>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 leading-relaxed font-light tracking-wide">
              {reading}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const UserMessageBox = ({ text, id }: { text: string; id: number }) => {
  return (
    <div
      style={{ animationDelay: `${id * 0.5}s` }}
      className="animate-float max-w-md lg:max-w-2xl transform transition-all duration-300 order-1"
    >
      <div className="p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md bg-white text-gray-900 border border-gray-200 bg-gradient-to-br from-slate-700 to-gray-800 text-white ml-auto">
        <div className="border-gray-100">
          <p className="text-sm lg:text-base leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
};
