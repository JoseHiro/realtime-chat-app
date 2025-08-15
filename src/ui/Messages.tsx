import { useRef, useState } from "react";
import { Bot, User, Play, Pause, MessageSquare, Volume2 } from "lucide-react";

export const Messages = ({
  history,
  audioList,
}: {
  history: any;
  audioList: any;
}) => {
  const messagesEndRef = useRef(null);
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
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [displayMode, setDisplayMode] = useState<"audio" | "text">("audio"); // 表示モード切り替え

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
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-gray-50">
      {/* 表示モード切り替えボタン */}
      <div className="flex justify-center mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-1 flex shadow-sm">
          <button
            onClick={() => setDisplayMode("audio")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              displayMode === "audio"
                ? "bg-green-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Volume2 className="w-4 h-4" />
            Audio
          </button>
          <button
            onClick={() => setDisplayMode("text")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              displayMode === "text"
                ? "bg-green-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Text
          </button>
        </div>
      </div>

      {/* 初期メッセージ */}
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

      {/* 履歴メッセージ */}
      {history.map((message: any, id: number) => (
        <div
          key={id}
          className={`flex gap-4 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "assistant" && (
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}

          <div
            className={`max-w-md lg:max-w-2xl ${
              message.role === "user" ? "order-1" : ""
            }`}
          >
            <div
              className={`p-4 rounded-2xl shadow-sm ${
                message.role === "user"
                  ? "bg-gray-900 text-white ml-auto"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              {displayMode === "audio" &&
              message.role !== "user" &&
              audioList[id] ? (
                // 音声表示モード
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (currentPlayingId === id + 1) {
                        stopAudio();
                      } else {
                        playAudio(id + 1);
                      }
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      message.role === "user"
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-green-100 hover:bg-green-200 text-green-600"
                    }`}
                  >
                    {currentPlayingId === id + 1 ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-0.5 rounded-full ${
                              message.role === "user"
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
                        message.role === "user"
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      Audio Message
                    </p>
                  </div>
                </div>
              ) : (
                // テキスト表示モード
                <p className="text-sm lg:text-base leading-relaxed">
                  {message.content}
                </p>
              )}
            </div>
          </div>

          {message.role === "user" && (
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
