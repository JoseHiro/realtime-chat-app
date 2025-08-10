import { useState, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  Plus,
  Settings,
  Menu,

} from "lucide-react";
import { VoiceInput } from "@/ui/VoiceInputButton";
import { Messages } from "@/ui/Messages";

const Chat = () => {
  // const handleSpeak = async () => {
  //   console.log(text);

  //   const res = await fetch("/api/tts", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ text }),
  //   });

  //   if (!res.ok) {
  //     console.error("TTS request failed");
  //     return;
  //   }

  //   const audioBlob = await res.blob();
  //   const audioUrl = URL.createObjectURL(audioBlob);
  //   const audio = new Audio(audioUrl);
  //   audio.play();
  // };

  // const azureSpeech = async () => {
  //   console.log(text);

  //   const res = await fetch("/api/azure-tts", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ text }),
  //   });

  //   if (!res.ok) {
  //     console.error("Azure TTS request failed");
  //     return;
  //   }

  //   const audioBlob = await res.blob();
  //   const audioUrl = URL.createObjectURL(audioBlob);
  //   const audio = new Audio(audioUrl);
  //   audio.play();
  // };

  const [audioList, setAudioList] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAITalking, setIsAITalking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevels, setAudioLevels] = useState(Array(20).fill(0));
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [text, setText] = useState("");
  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    []
  );



  const handleSubmitChat = async () => {
    console.log(text);
    const newMessages = [...history, { role: "user", content: text }];
    setHistory(newMessages);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    console.log(data.reply);
    setHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);

    console.log(newMessages, data.reply);

    if (data.audio) {
      const audioBuffer = Uint8Array.from(atob(data.audio), (c) =>
        c.charCodeAt(0)
      );
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
      console.log(audioUrl);
      setAudioList([...audioList, audioUrl]);
    }

    console.log(history, data.reply);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <div className="hidden lg:flex w-80 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex flex-col w-full p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Voice AI</h1>
          </div>

          <button className="flex items-center gap-3 p-4 rounded-xl bg-green-500 text-white mb-4 hover:bg-green-600 transition-all duration-200 shadow-sm">
            <Plus className="w-5 h-5" />
            新しい会話
          </button>

          <div className="flex-1 space-y-2">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-sm">
              音声会話履歴
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center gap-3 p-3 rounded-lg w-full transition-colors ${
                isMuted
                  ? "text-red-600 bg-red-50 border border-red-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
              {isMuted ? "ミュート中" : "音声オン"}
            </button>
            <button className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full transition-colors">
              <Settings className="w-5 h-5" />
              設定
            </button>
          </div>
        </div>
      </div>

      {/* メインチャットエリア */}
      <div className="flex-1 flex flex-col bg-white">
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-200 p-4 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-12 h-12 bg-green-500 rounded-full flex items-center justify-center ${
                      isAITalking ? "animate-pulse" : ""
                    }`}
                  >
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      isAITalking ? "bg-red-500 animate-pulse" : "bg-green-400"
                    }`}
                  ></div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    音声AI
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isAITalking ? "話しています..." : "オンライン"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 音声可視化エリア */}
        {(isRecording || isAITalking) && (
          <div className="bg-gray-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-center gap-1">
              {audioLevels.map((level, i) => (
                <div
                  key={i}
                  className={`w-1 transition-all duration-100 rounded-full ${
                    isRecording ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ height: `${Math.max(4, level / 2)}px` }}
                />
              ))}
            </div>
            <div className="text-center mt-4">
              <p
                className={`text-sm font-medium ${
                  isRecording ? "text-red-600" : "text-green-600"
                }`}
              >
                {isRecording
                  ? `録音中... ${formatTime(recordingTime)}`
                  : "AIが話しています..."}
              </p>
            </div>
          </div>
        )}

        {/* メッセージエリア */}
        <Messages history={history} audioList={audioList}/>

        <input
          type="text"
          className="border rounded border-gray-400 p-4 m-3 text-black "
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="border rounded border-gray-300 text-black "
          onClick={() => {
            handleSubmitChat();
          }}
        >
          Submit
        </button>

        {/* 音声入力エリア */}
        <div className="p-4 lg:p-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto flex items-center justify-center">
            <div className="relative">
              <VoiceInput />
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              {isRecording
                ? "マイクボタンを離して送信"
                : isAITalking
                ? "AIが応答中です..."
                : "マイクボタンを押しながら話してください"}
            </p>
          </div>
        </div>
      </div>
    </div>

    // <div className="text-black" style={{ padding: 20 }}>
    //   <h1>GPT TTS デモ</h1>
    //   <textarea
    //     className="border border-gray-300 rounded p-2"
    //     rows={3}
    //     style={{ width: "100%" }}
    //     value={text}
    //     onChange={(e) => setText(e.target.value)}
    //   />
    //   <button
    //     className="border rounded p-2"
    //     onClick={() => handleSpeak()}
    //     style={{ marginTop: 10 }}
    //   >
    //     音声にする
    //   </button>
    //   <button
    //     className="border rounded p-2"
    //     onClick={() => azureSpeech()}
    //     style={{ marginTop: 10 }}
    //   >
    //     Azure 音声にする
    //   </button>
    // </div>
  );
};

export default Chat;
