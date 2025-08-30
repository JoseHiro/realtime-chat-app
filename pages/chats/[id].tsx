import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../../ui/Sidebar";
import { Bot } from "lucide-react";

type Message = {
  id: string;
  sender: "user" | "assistant";
  message: string;
  reading?: string;
  createdAt: string;
};

type Chat = {
  title?: string;
  theme?: string;
  level?: string;
  politeness?: string;
  message: Message[];
};

const ChatPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [displayMode, setDisplayMode] = useState("text");
  const [currentPlayingId, setCurrentPlayingId] = useState<null | string>(null);

  const {
    data: chat,
    isLoading,
    error,
  } = useQuery<Chat>({
    queryKey: ["chat", id],
    queryFn: async () => {
      const res = await fetch(`/api/chats/${id}`);
      if (!res.ok) throw new Error("Failed to fetch chats");
      return res.json();
    },
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 音声再生機能（プレースホルダー）
  // const playAudio = (id) => {
  //   setCurrentPlayingId(id);
  //   // 実際の音声再生ロジックをここに実装
  // };

  const stopAudio = () => {
    setCurrentPlayingId(null);
  };

  return (
    <div className="relative w-full h-screen flex">
      <Sidebar />
      <div className="flex-1 min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50 overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className=" mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">{chat?.title}</h1>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {chat?.theme}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {chat?.level}
              </span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {chat?.politeness}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="h-full overflow-y-auto">
          <div className="flex-1 p-4 lg:p-6 space-y-6 bg-gradient-to-b from-slate-50 to-gray-50">
            {/* Display Mode Toggle */}
            {/* <div className="flex justify-center mb-4">
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
            {chat?.message.map((message: Message) => (
              <div
                key={message.id}
                className={`flex gap-4 transition-all duration-300 ease-out ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Text
                </button>
              </div>
            </div> */}

            {/* Messages */}
            {chat?.message.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 transition-all duration-300 ease-out ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "assistant" && (
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-md lg:max-w-2xl transform transition-all duration-300 ${
                    message.sender === "user" ? "order-1" : ""
                  }`}
                >
                  <div
                    className={`p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                      message.sender === "user"
                        ? "bg-gradient-to-br from-slate-700 to-gray-800 text-white ml-auto"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    {displayMode === "audio" &&
                    message.sender === "assistant" ? (
                      // Audio display mode
                      <div className="flex items-center gap-3">
                        {/* <button
                          onClick={() => {
                            if (currentPlayingId === message.id) {
                              stopAudio();
                            }
                             else {
                              playAudio(message.id);
                            }
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                            message.sender === "user"
                              ? "bg-white/20 hover:bg-white/30 text-white"
                              : "bg-emerald-100 hover:bg-emerald-200 text-emerald-600 shadow-sm"
                          }`}
                        >
                          {currentPlayingId === message.id ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
                        </button> */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1 rounded-full transition-all duration-200 ${
                                    currentPlayingId === message.id
                                      ? message.sender === "user"
                                        ? "bg-white animate-pulse"
                                        : "bg-emerald-500 animate-pulse"
                                      : message.sender === "user"
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
                        </div>
                      </div>
                    ) : (
                      // Text display mode
                      <div>
                        <p className="text-sm lg:text-base leading-relaxed">
                          {message.message}
                        </p>
                        {message.sender === "assistant" && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-[10px] text-gray-400 leading-relaxed font-light tracking-wide">
                              {message.reading}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-2 px-4">
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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

export default ChatPage;
