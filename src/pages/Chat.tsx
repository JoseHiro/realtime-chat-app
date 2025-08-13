import { useState } from "react";
import { Bot, Menu } from "lucide-react";
import { VoiceInput } from "@/ui/VoiceInputButton";
import { Messages } from "@/ui/Messages";
import { Overlay } from "@/component/overlay";
import { Summary } from "@/ui/Summar";
import { Sidebar } from "@/ui/Sidebar";
import { Header } from "@/ui/Header";
import { ModeSelectScreen } from "@/ui/ModeSelectScreen";

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
  // const [text, setText] = useState("");
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

  // const handleSubmitChat = async () => {
  //   if (!text.trim()) {
  //     return;
  //   }

  //   // ここで履歴を追加してから API を呼び出す
  //   setHistory((prev) => {
  //     const newMessages = [...prev, { role: "user", content: text }];
  //     sendToAPI(newMessages);
  //     return newMessages;
  //   });
  // };

  const sendToAPI = async (messages) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
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

      <ModeSelectScreen />
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
