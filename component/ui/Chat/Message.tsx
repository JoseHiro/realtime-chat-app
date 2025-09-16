import { Play, Pause, Languages } from "lucide-react";
import React, { useRef, useState } from "react";
import { SoundWave } from "./SoundWave";

export const AssistantMessageBox = ({
  text,
  reading,
  displayMode,
  chatInfo,
  id,
  english,
}: {
  text: string;
  reading: string;
  displayMode?: string;
  chatInfo?: { audioUrl: string; english: string }[];
  id: number;
  english?: string;
}) => {

  console.log(reading);

  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [displayEnglishSentence, setDisplayEnglishSentence] = useState<
    null | number
  >(null);

  // const { isMuted } = useSpeech();
  // Create audioList from chatInfo if available
  // const audioList = chatInfo?.map(info => info.audioUrl) ?? [];

  const playAudio = (id: number) => {
    // if(!isMuted) return;
    if(chatInfo === undefined) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(chatInfo[id - 1].audioUrl);
    audioRef.current = audio;
    audio.muted = true;
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

  const handleDisplayEnglishSentence = (id: number) => {
    setDisplayEnglishSentence((prev) => (id === prev ? null : id));
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
            <SoundWave
              currentPlayingId={!!currentPlayingId}
              audioUrl={chatInfo?.[id]?.audioUrl ?? ""}
            />
            <p className="text-xs font-medium text-gray-500 mt-2">
              {currentPlayingId === id + 1 ? "Playing..." : "Audio Message"}
            </p>
          </div>
        </div>
      ) : (
        <div className=" border-gray-100">
          <p className="text-sm lg:text-base leading-relaxed">{text}</p>
          <div className="flex justify-between">
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 leading-relaxed font-light tracking-wide">
                {reading}
              </p>
            </div>
          </div>
          {((chatInfo && chatInfo[id]?.english !== "") || english !== null) && (
            <>
              <button
                onClick={() => handleDisplayEnglishSentence(id)}
                className={`text-gray-500 border p-1 hover:bg-gray-100 transition flex items-center space-x-1 rounded text-xs mt-2 ${
                  displayEnglishSentence === id
                    ? "bg-green-50 text-green-700 border border-green-200 shadow-sm"
                    : ""
                }`}
              >
                <Languages className="w-4 h-4 text-bold" /> Show translation
              </button>
              {displayEnglishSentence === id && (
                <div className="mt-1 border-gray-100">
                  <p className="text-sm text-gray-600 italic leading-relaxed">
                    {(chatInfo && chatInfo[id]?.english) || english}
                  </p>
                </div>
              )}
            </>
          )}
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
