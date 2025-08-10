import React, { useState, useRef } from "react";
import { Bot, User, Pause, Play } from "lucide-react";

export const Messages = ({
  history,
  audioList,
}: {
  history: any;
  audioList: any;
}) => {
  const messagesEndRef = useRef(null);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "こんにちは！音声で会話を始めましょう。マイクボタンを押して話しかけてください。",
      timestamp: new Date(),
      duration: 3.2,
    },
  ]);
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
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-gray-50">
      {history.length === 0 &&
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "ai" && (
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            <div
              className={`max-w-md lg:max-w-2xl ${
                message.type === "user" ? "order-1" : ""
              }`}
            >
              <div
                className={`p-4 rounded-2xl shadow-sm ${
                  message.type === "user"
                    ? "bg-gray-900 text-white ml-auto"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <p className="text-sm lg:text-base leading-relaxed">
                  {message.content}
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-2 px-4">
                {message.timestamp.toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {message.type === "user" && (
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
      {history.map((message, id: index) => (
        <div
          key={id}
          className={`flex gap-4 ${
            message.type === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "assistant" && (
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}

          <div
            className={`max-w-md lg:max-w-2xl ${
              message.type === "user" ? "order-1" : ""
            }`}
          >
            <div
              className={`p-4 rounded-2xl shadow-sm ${
                message.type === "user"
                  ? "bg-gray-900 text-white ml-auto"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              {audioList[id - 1] ? (
                <div className="flex items-center gap-3">
                  <button
                    // onClick={() => playMessage(message.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      message.type === "user"
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-green-100 hover:bg-green-200 text-green-600"
                    }`}
                  >
                    {audioList[id - 1] ? (
                      currentPlayingId === id ? (
                        <Pause
                          className="w-4 h-4"
                          onClick={() => {
                            stopAudio(id);
                            setCurrentPlayingId(null);
                          }}
                        />
                      ) : (
                        <Play
                          className="w-4 h-4"
                          onClick={() => {
                            playAudio(id);
                            setCurrentPlayingId(id);
                          }}
                        />
                      )
                    ) : (
                      <></>
                    )}
                    {/* {audioList[id - 1] &&
                    currentPlayingId === id &&
                    playingAudio ? (
                      <Pause
                        className="w-4 h-4"
                        onClick={() => {
                          stopAudio(id);
                          setCurrentPlayingId(null);
                        }}
                      />
                    ) : (
                      <Play
                        className="w-4 h-4 ml-0.5"
                        onClick={() => {
                          playAudio(id);
                          setCurrentPlayingId(id);
                        }}
                      />
                    )} */}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-0.5 rounded-full ${
                              message.type === "user"
                                ? "bg-white/60"
                                : "bg-green-400"
                            }`}
                            style={{
                              height: `${Math.random() * 12 + 4}px`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p
                      className={`text-xs ${
                        message.type === "user"
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      {/* {formatDuration(message.duration)} */}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm lg:text-base leading-relaxed">
                  {message.content}
                </p>
              )}
            </div>
            {/* <p className="text-xs text-gray-400 mt-2 px-4">
              {message.timestamp.toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p> */}
          </div>

          {message.type === "user" && (
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
