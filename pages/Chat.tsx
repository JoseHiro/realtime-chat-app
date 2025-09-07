import { useState, useEffect } from "react";
import { VoiceInput } from "../component/ui/VoiceInputButton";
import { Messages } from "../component/ui/Messages";
import { Overlay } from "../component/overlay";
import { Sidebar } from "../component/ui/Sidebar";
import { Header } from "../component/ui/Header";
import { ModeSelectScreen } from "../component/ui/ModeSelectScreen";
import { useSpeech } from "../context/SpeechContext";
import { SummaryData, ChatType } from "../type/types";
import { useQuery } from "@tanstack/react-query";
import { PaymentPromotionContent } from "../component/ui/PaymentPromotionContent";
import { apiRequest } from "../lib/apiRequest";
import { SummaryContent } from "../component/ui/SummaryContent";
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

// authenticate return to login page [x]
// payment for trial account, after payment activate[x]
// cancel message input after chat is completed[x]
// generate original chat title after finishing chat[x]
// reading for the kanji[x]
// not enough chat data and won't get the summary[]
// loading starting chat[x] loading for data fetch[]
// display username in the conversation[x]
// use username in the conversation[x]
// english reading[]
// popup message[]
// display summary for each chat page
// beautify chat style
// block reloading (Prevent stopping conversation)
//
//

export const Chat = () => {
  const {
    selectedPoliteness,
    selectedLevel,
    checkGrammarMode,
    chatId,
    chatMode,
    setChatEnded,
    setChatId,
    setUsername,
    setSubscriptionPlan,
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
  const [summaryFetchLoading, setSummaryFetchLoading] = useState(false);

  console.log(summary);

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch trial data");
      }
      return response.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (data?.trialStatus === "ended") {
      setPaymentOverlay(true);
    }
    setUsername(data?.user.username);
    setSubscriptionPlan(data?.user.subscriptionPlan);
  }, [data]);

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

  const handleRefreshPreviousData = () => {
    setAudioList([]);
    setSummary(null);
    setHistory([]);
    setHiraganaReadingList([]);
  };

  // Create a summary of the conversation history
  const handleCreateSummary = async () => {
    setSummaryFetchLoading(true);
    try {
      const data = await apiRequest("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history,
          chatId,
          politeness: selectedPoliteness,
        }),
      });

      if (data?.status === 204 || !data?.summary) {
        setSummary(null);
      } else {
        setSummary(data);
      }
    } catch (error) {
      console.error("Error creating summary:", error);
    } finally {
      setChatEnded(true);
      setChatId(null);
      setSummaryFetchLoading(false);
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
            trialError={false}
            handleRefreshPreviousData={handleRefreshPreviousData}
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
        <Overlay
          onClose={() => {
            setOverlayOpened(false);
            setSummaryOpened(false);
          }}
        >
          <SummaryContent
            summaryOpened={summaryOpened}
            setSummaryOpened={setSummaryOpened}
            summary={summary}
            summaryFetchLoading={summaryFetchLoading}
          />
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
