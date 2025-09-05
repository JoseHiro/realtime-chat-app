import { useState, useEffect } from "react";
import { VoiceInput } from "../component/ui/VoiceInputButton";
import { Messages } from "../component/ui/Messages";
import { Overlay } from "../component/overlay";
import { Summary } from "../component/ui/Summary";
import { Sidebar } from "../component/ui/Sidebar";
import { Header } from "../component/ui/Header";
import { ModeSelectScreen } from "../component/ui/ModeSelectScreen";
import { useSpeech } from "../context/SpeechContext";
import { Clock } from "lucide-react";
import { SummaryData, ChatType } from "../type/types";
import { useQuery } from "@tanstack/react-query";
import { PaymentPromotionContent } from "../component/ui/PaymentPromotionContent";
import { apiRequest } from "../lib/apiRequest";

// notes : common mistakes, tendencies,
// vocabulary, natural word selection,
// UI while the chat is thinking
// when chat appears, scroll to bottom
// fix your grammar during the conversation
// formal learning explanation
// casual form if its natural, streets corrects
// simulation roleplay
// cannot respond while AI talking

// signin
// chat list sidebar
// pricing

// authenticate return to login page []
// payment for trial account, after payment activate[x]
// cancel message input after chat is completed[x]
// generate original chat title after finishing chat[]
// reading for the kanji[x]
// not enough chat data and won't get the summary[]
// loading starting chat
// display username in the conversation
// english reading
// popup message

export const Chat = () => {
  const {
    selectedPoliteness,
    selectedLevel,
    checkGrammarMode,
    chatId,
    chatMode,
    setChatEnded,
    setChatId,
  } = useSpeech();

  const [audioList, setAudioList] = useState<string[]>([]);
  const [overlayOpened, setOverlayOpened] = useState<boolean>(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [summaryOpened, setSummaryOpened] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [hiraganaReadingList, setHiraganaReadingList] = useState<string[]>([]);
  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    []
  );
  const [paymentOverlay, setPaymentOverlay] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["trial"],
    queryFn: async () => {
      const response = await fetch("/api/trial");
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch trial data");
      }
      return response.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (error) {
      const err: any = error;
      if (
        err.message.includes("Trial period ended") ||
        err.message.includes("Trial limit reached")
      ) {
        setPaymentOverlay(true);
      }
    }
  }, [error]);

  // Send messages to the API and get the response and audio
  const sendToAPI = async (messages: ChatType) => {
    setChatLoading(true);

    try {
      const data = await apiRequest("/api/chat/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          politeness: selectedPoliteness,
          level: selectedLevel,
          history,
          checkGrammarMode,
          chatId,
        }),
      });

      setChatLoading(false);
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      setHiraganaReadingList((prev) => [...prev, data.reading]);

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
    } catch (error) {
      console.error("sendToAPI error:", error);
    } finally {
      setChatLoading(false);
    }
  };

  // Create a summary of the conversation history
  const handleCreateSummary = async () => {
    try {
      const data = await apiRequest("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: history, chatId }),
      });

      setSummary(data);
    } catch (error) {
      console.error("Error creating summary:", error);
    } finally {
      setChatEnded(true);
      setChatId(null);
    }
  };

  return (
    <div className="relative w-full h-screen flex">
      {/* サイドバー */}
      <Sidebar />

      {!chatMode ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 overflow-auto w-full">
          <ModeSelectScreen
            setHistory={setHistory}
            setAudioList={setAudioList}
            setHiraganaReadingList={setHiraganaReadingList}
            setPaymentOverlay={setPaymentOverlay}
            trialError={
              !!error &&
              (error.message.includes("Trial period ended") ||
                error.message.includes("Trial limit reached"))
            }
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
          />
          <VoiceInput
            history={history}
            setHistory={setHistory}
            sendToAPI={sendToAPI}
            setHiraganaReadingList={setHiraganaReadingList}
          />
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
      )}

      {paymentOverlay && (
        <Overlay onClose={() => setPaymentOverlay(false)}>
          <PaymentPromotionContent onClose={() => setPaymentOverlay(false)} />
        </Overlay>
      )}
    </div>
  );
};

export default Chat;
