import { useState } from "react";
import { VoiceInput } from "@/ui/VoiceInputButton";
import { Messages } from "@/ui/Messages";
import { Overlay } from "@/component/overlay";
import { Summary } from "@/ui/Summar";
import { Sidebar } from "@/ui/Sidebar";
import { Header } from "@/ui/Header";
import { ModeSelectScreen } from "@/ui/ModeSelectScreen";
import { useSpeech } from "../context/SpeechContext";

// notes : common mistakes, tendencies,
// vocabulary, natural word selection,

const Chat = () => {
  const { selectedPoliteness, selectedLevel, selectedTheme, customTheme } =
    useSpeech();

  const [audioList, setAudioList] = useState<string[]>([]);
  const [chatStart, setChartStart] = useState(false);
  const [openOverlay, setOpenOverlay] = useState(false);
  const [summary, setSummary] = useState({
    summary:
      "ユーザーは友達と映画を見たが、ストーリーが分からなかったため少しつまらなかったと話しています。映画はサスペンスで、主人公が逃げる途中に事故で亡くなりますが、有名な俳優が出ていなかったため違和感を感じたそうです。",
    mistakes: ["主人公が最後死んだです。", "有名じゃないだから"],
    corrections: ["主人公が最後に死にました。", "有名じゃないので"],
    goodPoints: [
      "会話がスムーズに進んでいる。",
      "自分の意見をはっきり述べている。",
    ],
    difficultyLevel: "N4",
    improvementPoints: ["文の構造を整理する。", "助詞の使い方を注意する。"],
  });

  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    []
  );

  // Send messages to the API and get the response and audio
  const sendToAPI = async (messages: any) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        selectedPoliteness,
        selectedLevel,
        history,
      }),
    });

    const data = await res.json();
    console.log(data.reply);

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

  const handleCreateSummary = async () => {
    try {
      const res = await fetch("/api/summary-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "hello" }),
      });

      const data = await res.json();
      console.log("Summary response:", data);
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
            summary={summary}
            setOpenOverlay={setOpenOverlay}
            handleCreateSummary={handleCreateSummary}
          />
          <Messages history={history} audioList={audioList} />
          <VoiceInput
            setHistory={setHistory}
            setAudioList={setAudioList}
            audioList={audioList}
            sendToAPI={sendToAPI}
            history={history}
          />
        </div>
      )}

      {/* メインチャットエリア */}
      {openOverlay && (
        <Overlay onClose={() => setOpenOverlay(false)}>
          <Summary summary={summary} />
        </Overlay>
      )}
    </div>
  );
};

export default Chat;
