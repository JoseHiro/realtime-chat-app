import React, { useRef, useState, useEffect } from "react";
import { Bot, User, Play, Pause, MessageSquare, Volume2 } from "lucide-react";
import { LoadingMessage } from "@/component/loading";
export const Messages = ({
  history,
  audioList,
  chatLoading,
}: {
  chatLoading: boolean;
  history: any[];
  audioList: any[];
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState<"audio" | "text">("audio");

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [history, chatLoading]);

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

  // AI-style loading animation component
  // const LoadingMessage = () => (
  //   <div className="flex gap-4 justify-start">
  //     <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
  //       <Bot className="w-5 h-5 text-white" />
  //     </div>

  //     <div className="max-w-md lg:max-w-2xl">
  //       <div className="bg-white text-gray-900 border border-gray-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
  //         {/* Scanning line effect */}
  //         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent w-full h-full animate-pulse"></div>

  //         {/* Neural network style animation */}
  //         <div className="relative">
  //           <div className="flex items-center justify-between mb-6">
  //             <div className="flex items-center gap-3">
  //               <div className="relative">
  //                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
  //                 <div className="absolute inset-0 w-3 h-3 bg-emerald-600 rounded-full"></div>
  //               </div>
  //               <span className="text-emerald-600 text-sm font-semibold tracking-wide">
  //                 Thinking about your response
  //               </span>
  //             </div>
  //           </div>

  //           {/* AI processing visualization */}
  //           <div className="space-y-3">
  //             {[
  //               { width: "85%", delay: "0ms" },
  //               { width: "92%", delay: "200ms" },
  //               { width: "78%", delay: "400ms" },
  //               { width: "95%", delay: "600ms" },
  //             ].map((line, i) => (
  //               <div key={i} className="relative">
  //                 <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
  //                   <div
  //                     className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full animate-pulse"
  //                     style={{
  //                       width: line.width,
  //                       animationDelay: line.delay,
  //                       animationDuration: "1.5s",
  //                     }}
  //                   ></div>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>

  //           {/* Floating particles */}
  //           <div className="absolute inset-0 pointer-events-none">
  //             {Array.from({ length: 8 }).map((_, i) => (
  //               <div
  //                 key={i}
  //                 className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-60"
  //                 style={{
  //                   left: `${20 + i * 10}%`,
  //                   top: `${30 + (i % 3) * 20}%`,
  //                   animation: `float 3s ease-in-out infinite`,
  //                   animationDelay: `${i * 0.3}s`,
  //                 }}
  //               ></div>
  //             ))}
  //           </div>

  //           <div className="mt-4 text-center">
  //             <span className="text-gray-500 text-xs font-medium">
  //               Generating intelligent response...
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-gradient-to-b from-slate-50 to-gray-50">
      {/* Display Mode Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-white rounded-xl border border-gray-200 p-1 flex shadow-sm">
          <button
            onClick={() => setDisplayMode("audio")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              displayMode === "audio"
                ? "bg-emerald-500 text-white shadow-sm transform scale-105"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Volume2 className="w-4 h-4" />
            Audio
          </button>
          <button
            onClick={() => setDisplayMode("text")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              displayMode === "text"
                ? "bg-emerald-500 text-white shadow-sm transform scale-105"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Text
          </button>
        </div>
      </div>

      {/* Messages */}
      {history.map((message: any, id: number) => (
        <div
          key={id}
          className={`flex gap-4 transition-all duration-300 ease-out ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "assistant" && (
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}

          <div
            className={`max-w-md lg:max-w-2xl transform transition-all duration-300 ${
              message.role === "user" ? "order-1" : ""
            }`}
          >
            <div
              className={`p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                message.role === "user"
                  ? "bg-gradient-to-br from-slate-700 to-gray-800 text-white ml-auto"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              {displayMode === "audio" &&
              message.role !== "user" &&
              audioList[id] ? (
                // Audio display mode
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (currentPlayingId === id + 1) {
                        stopAudio();
                      } else {
                        playAudio(id + 1);
                      }
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                      message.role === "user"
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-emerald-100 hover:bg-emerald-200 text-emerald-600 shadow-sm"
                    }`}
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
                                ? message.role === "user"
                                  ? "bg-white animate-pulse"
                                  : "bg-emerald-500 animate-pulse"
                                : message.role === "user"
                                ? "bg-white/60"
                                : "bg-emerald-300"
                            }`}
                            style={{
                              height: `${Math.random() * 12 + 4}px`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p
                      className={`text-xs font-medium ${
                        message.role === "user"
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      {currentPlayingId === id + 1
                        ? "Playing..."
                        : "Audio Message"}
                    </p>
                  </div>
                </div>
              ) : (
                // Text display mode
                <p className="text-sm lg:text-base leading-relaxed">
                  {message.content}
                </p>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-2 px-4">
              {new Date().toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {message.role === "user" && (
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ))}

      {/* Loading Message */}
      {chatLoading && <LoadingMessage />}

      <div ref={messagesEndRef} />

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.5);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-8px) scale(1.1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
