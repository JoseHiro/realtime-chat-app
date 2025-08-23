import { useState } from "react";
import { VoiceInput } from "../ui/VoiceInputButton";
import { Messages } from "../ui/Messages";
import { Overlay } from "../component/overlay";
import { Summary } from "../ui/Summary";
import { Sidebar } from "../ui/Sidebar";
import { Header } from "../ui/Header";
import { ModeSelectScreen } from "../ui/ModeSelectScreen";
import { useSpeech } from "../context/SpeechContext";
import { Clock } from "lucide-react";
import { SummaryData, ChatType } from "../type/types";
import Image from "next/image";

// notes : common mistakes, tendencies,
// vocabulary, natural word selection,
// UI while the chat is thinking
// when chat appears, scroll to bottom
// fix your grammar during the conversation
// formal learning explanation
// casual form if its natural, streets corrects
// simulation roleplay

export const Chat = () => {
  const { selectedPoliteness, selectedLevel, checkGrammarMode } = useSpeech();
  const [audioList, setAudioList] = useState<string[]>([]);
  const [chatStart, setChartStart] = useState<boolean>(false);
  const [overlayOpened, setOverlayOpened] = useState<boolean>(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [summaryOpened, setSummaryOpened] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [hiraganaReadingList, setHiraganaReadingList] = useState<string[]>([]);
  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    []
  );

  // console.log(summary);
  // console.log(history);

  const handleSetReading = async (text: string) => {
    const response = await fetch("/api/kuromoji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    console.log(data.hiragana);
    setHiraganaReadingList((prev) => [...prev, data.hiragana]);
  };

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
        checkGrammarMode,
      }),
    });

    const data = await res.json();

    setChatLoading(false);
    setHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
    handleSetReading(data.reply);

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
      setSummary(data);
    } catch (error) {
      console.error("Error creating summary:", error);
    }
  };

  return (
    <div className="relative w-full h-screen flex">
      {/* サイドバー */}
      <Sidebar />

      {!chatStart ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 overflow-auto w-full">
          <ModeSelectScreen
            setHistory={setHistory}
            setAudioList={setAudioList}
            setChartStart={setChartStart}
            handleSetReading={handleSetReading}
          />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 w-full flex flex-col justify-between">
          <Header
            setOverlayOpened={setOverlayOpened}
            summary={summary}
            handleCreateSummary={handleCreateSummary}
          />
          <Messages
            history={history}
            audioList={audioList}
            chatLoading={chatLoading}
            hiraganaReadingList={hiraganaReadingList}
            handleSetReading={handleSetReading}
          />
          <VoiceInput setHistory={setHistory} sendToAPI={sendToAPI} />
        </div>
      )}

      {/* 時間切れ時のオーバーレイ */}
      {/* {overlayOpened && (
        <Overlay onClose={() => setOverlayOpened(false)}>
          {!summaryOpened ? (
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Conversation Finished
              </h2>
              <p className="text-gray-600 mb-6">
                Good job! Please check the summary of your conversation.
              </p>
              <button
                onClick={() => setSummaryOpened(true)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                View Summary
              </button>
            </div>
          ) : (
            <Summary summary={summary} />
          )}
        </Overlay>
      )} */}
      {/* bg-gradient-to-br from-orange-400 via-pink-400 to-blue-500 */}
      {/* <div
        className="relative w-full h-screen flex
      "
      > */}
      {/* 背景画像 */}
      {/* <Image
        alt="background"
        src="https://images.squarespace-cdn.com/content/v1/6683b1f0c2de43611580eee6/a2e980a9-0a96-4008-ba49-3502afbcce82/mt-fuji-japan-7081138_1280-pixabay-202408300-yoshitaka2.jpg"
        fill
        className="object-cover"
      /> */}

      {/* オーバーレイ（背景の上にかける） */}
      {/* <div className="absolute inset-0 bg-blue/20 backdrop-blur-lg" /> */}
      {/* サイドバー */}
      {/* <Sidebar /> */}

      {/* {!chatStart ? (
        <ModeSelectScreen
          setHistory={setHistory}
          setAudioList={setAudioList}
          setChartStart={setChartStart}
          handleSetReading={handleSetReading}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 w-full flex flex-col justify-between">
          <Header
            setOverlayOpened={setOverlayOpened}
            summary={summary}
            handleCreateSummary={handleCreateSummary}
          />
          <Messages
            history={history}
            audioList={audioList}
            chatLoading={chatLoading}
            hiraganaReadingList={hiraganaReadingList}
            handleSetReading={handleSetReading}
          />
          <VoiceInput setHistory={setHistory} sendToAPI={sendToAPI} />
        </div>
      )} */}

      {/* カード（オーバーレイの上に出す） */}
      {/* <div className="z-10 flex items-center justify-center bg-white/15 backdrop-blur-xl h-full">
          <div className="border border-white rounded-xl p-6 bg-white/20 backdrop-blur-md">
            <h3 className="text-white text-xl">Card Name</h3>
          </div>
        </div> */}

      {/* カード */}
      {/* <div className="relative z-10 flex items-center justify-center h-full">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-2">Eagle Ridge Loop</h2>
            <p className="text-gray-700">7.4 miles • 3hr 15min • 1000ft</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Book a tour
            </button>
          </div>
        </div> */}
      {/* <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-pink-300/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-blue-300/15 rounded-full blur-xl" /> */}
    </div>
    // </div>
  );
};

export default Chat;
