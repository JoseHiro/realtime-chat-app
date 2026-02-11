import { useState, useCallback } from "react";
import { Messages } from "../component/ui/Chat/Messages";
import { Overlay } from "../component/overlay";
import { Sidebar } from "../component/ui/Sidebar";
import { ModeSelectScreen } from "../component/ui/ModeSelectScreen";
import { useChatSession } from "../context/ChatSessionContext";
import { useSummary } from "../context/SummaryContext";
import { PaymentPromotionContent } from "../component/ui/PaymentPromotionContent";
import { SummaryContent } from "../component/ui/SummaryContent";
import { ChatHeader } from "../component/ui/Chat/ChatHeader";
import { StopWatch } from "../component/ui/Chat/StopWatch";
import { ChatFooter } from "../component/ui/Chat/Footer";
import { useBeginConversation } from "../features/new-chat";
import { useUserData } from "../features/user-trail";
import { toast } from "sonner";

export const Chat = () => {
  const {
    selectedPoliteness,
    selectedLevel,
    checkGrammarMode,
    chatId,
    setChatId,
    chatMode,
    setChatMode,
    selectedCharacter,
    selectedTime,
    selectedTheme,
    customTheme,
    chatEnded,
    setChatEnded,
  } = useChatSession();
  const { summary, setSummary, summaryFetchLoading, setSummaryFetchLoading } =
    useSummary();

  const [chatInfo, setChatInfo] = useState<
    { audioUrl: string; english: string }[]
  >([]);
  const [overlayOpened, setOverlayOpened] = useState<boolean>(false);
  const [summaryOpened, setSummaryOpened] = useState<boolean>(false);
  const [hiraganaReadingList, setHiraganaReadingList] = useState<string[]>([]);
  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [paymentOverlay, setPaymentOverlay] = useState(false);
  const [MessagesTextOpenMode, setMessagesTextOpenMode] = useState(true);
  const [textInputMode, setTextInputMode] = useState(true);
  const [hiraganaReading, setHiraganaReading] = useState(true);

  // const handleSendMessage = useCallback((text: string) => {
  //   // Optimistically add user message
  //   setHistory((prev) => [...prev, { role: "user", content: text }]);
  //   // TODO: Send to Realtime API if supported or Backend
  //   console.log("Sending text message:", text);
  //   // Ideally we would trigger the agent response here
  // }, []);

  const { needPayment, plan } = useUserData({ setPaymentOverlay });

  const handleRefreshPreviousData = useCallback(() => {
    setChatInfo([]);
    setSummary(null);
    setHistory([]);
    setHiraganaReadingList([]);
  }, [setSummary]);

  const { handleBeginConversation, sendTextMessage, loading } =
    useBeginConversation({
      needPayment,
      plan,
      setPaymentOverlay,
      handleRefreshPreviousData,
      setChatId,
      setChatMode,
      setHistory,
      selectedLevel: selectedLevel ?? "",
      selectedTheme: selectedTheme ?? "",
      customTheme: customTheme ?? "",
      selectedPoliteness: selectedPoliteness ?? "polite",
      selectedTime: selectedTime ?? 3,
      selectedCharacter: selectedCharacter ?? "Sakura",
    });

  return (
    <div className="relative w-full h-screen flex">
      {/* サイドバー */}
      <Sidebar />
      {!chatMode ? (
        // <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-green-50 overflow-auto w-full">
        <ModeSelectScreen
          setHistory={setHistory}
          setChatInfo={setChatInfo}
          loading={loading}
          setHiraganaReadingList={setHiraganaReadingList}
          setPaymentOverlay={setPaymentOverlay}
          needPayment={needPayment}
          plan={plan}
          handleRefreshPreviousData={handleRefreshPreviousData}
          handleBeginConversation={handleBeginConversation}
        />
      ) : (
        // </div>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 w-full flex flex-col justify-between">
          <ChatHeader
            title="Chat"
            chatPage={true}
            history={history}
            characterName={selectedCharacter}
          />
          <Messages
            history={history}
            chatInfo={chatInfo}
            chatLoading={false} // Realtime API handles loading internally
            hiraganaReadingList={hiraganaReadingList}
            characterName={selectedCharacter}
            MessagesTextOpenMode={MessagesTextOpenMode}
          />
          {/* Voice Status Indicator */}
          <ChatFooter
            MessagesTextOpenMode={MessagesTextOpenMode}
            setMessagesTextOpenMode={setMessagesTextOpenMode}
            textInputMode={textInputMode}
            setTextInputMode={setTextInputMode}
            hiraganaReading={hiraganaReading}
            setHiraganaReading={setHiraganaReading}
            sendTextMessage={sendTextMessage}
          />
          {/* Timer */}
          {chatId && selectedTime && (
            <div className="absolute top-20 right-4">
              <StopWatch
                history={history}
                setOverlayOpened={setOverlayOpened}
                chatDurationMinutes={selectedTime}
              />
            </div>
          )}
        </div>
      )}

      {/* 時間切れ時のオーバーレイ */}
      {overlayOpened && (
        <Overlay
          onClose={() => {
            if (summaryFetchLoading) {
              toast.info("Summary generation in progress", {
                description: "We'll notify you when your summary is ready.",
                position: "top-center",
              });
            }
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
          <PaymentPromotionContent
            isPro={plan === "pro"}
            onClose={() => setPaymentOverlay(false)}
          />
        </Overlay>
      )}
    </div>
  );
};

export default Chat;
