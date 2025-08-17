import { useState } from "react";
import { VoiceInput } from "@/ui/VoiceInputButton";
import { Messages } from "@/ui/Messages";
import { Overlay } from "@/component/overlay";
import { Summary } from "@/ui/Summary";
import { Sidebar } from "@/ui/Sidebar";
import { Header } from "@/ui/Header";
import { ModeSelectScreen } from "@/ui/ModeSelectScreen";
import { useSpeech } from "../context/SpeechContext";
import { Clock } from "lucide-react";
import { SummaryData, ChatType } from "@/type/types";

// notes : common mistakes, tendencies,
// vocabulary, natural word selection,
// UI while the chat is thinking
// when chat appears, scroll to bottom
// fix your grammar during the conversation

export const Chat = () => {
  const { selectedPoliteness, selectedLevel } = useSpeech();
  const [audioList, setAudioList] = useState<string[]>([]);
  const [chatStart, setChartStart] = useState<boolean>(false);
  const [overlayOpened, setOverlayOpened] = useState<boolean>(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [summaryOpened, setSummaryOpened] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    []
  );

  console.log(summary);
  console.log(history);

  // Send messages to the API and get the response and audio
  const sendToAPI = async (messages: ChatType) => {
    setChatLoading(true);

    const res = await fetch("/api/generate-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        politeness: selectedPoliteness,
        level: selectedLevel,
        history,
      }),
    });

    const data = await res.json();

    setChatLoading(false);
    // アシスタントの返事を追加
    setHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);

    if (data.audio) {
      const audioBuffer = Uint8Array.from(atob(data.audio), (c) =>
        c.charCodeAt(0)
      );
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
      setAudioList((prev) => [...prev, audioUrl]);
    }
  };

  // Create a summary of the conversation history
  const handleCreateSummary = async () => {
    try {
      const res = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: history }),
      });

      const data = await res.json();
      // console.log("Summary response:", data);
      setSummary(data);
    } catch (error) {
      console.error("Error creating summary:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <Sidebar />

      {!chatStart ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 overflow-auto w-full">
          <ModeSelectScreen
            setHistory={setHistory}
            setAudioList={setAudioList}
            setChartStart={setChartStart}
          />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 w-full flex flex-col justify-between">
          <Header
            // overlayOpened={overlayOpened}
            setOverlayOpened={setOverlayOpened}
            summary={summary}
            handleCreateSummary={handleCreateSummary}
          />
          <Messages
            history={history}
            audioList={audioList}
            chatLoading={chatLoading}
          />
          <VoiceInput setHistory={setHistory} sendToAPI={sendToAPI} />
        </div>
      )}

      {/* 時間切れ時のオーバーレイ */}
      {overlayOpened && (
        <Overlay onClose={() => setOverlayOpened(false)}>
          {!summaryOpened ? (
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                会話が終了しました
              </h2>
              <p className="text-gray-600 mb-6">
                お疲れさまでした！会話の要約をご確認ください。
              </p>
              <button
                onClick={() => {
                  // setChatEnded(false);
                  setSummaryOpened(true);
                }}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                要約を確認する
              </button>
            </div>
          ) : (
            <Summary summary={summary} />
          )}
        </Overlay>
      )}
    </div>
  );
};

export default Chat;
