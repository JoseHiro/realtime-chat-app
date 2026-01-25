import { useState, useEffect, useRef, useCallback } from "react";
import { Messages } from "../component/ui/Chat/Messages";
import { Overlay } from "../component/overlay";
import { Sidebar } from "../component/ui/Sidebar";
import { ModeSelectScreen } from "../component/ui/ModeSelectScreen";
import { useSpeech } from "../context/SpeechContext";
import { useQuery } from "@tanstack/react-query";
import { PaymentPromotionContent } from "../component/ui/PaymentPromotionContent";
import { SummaryContent } from "../component/ui/SummaryContent";
import { ChatHeader } from "../component/ui/Chat/ChatHeader";
import { StopWatch } from "../component/ui/Chat/StopWatch";
import { ChatFooter } from "../component/ui/Chat/Footer";
import { toast } from "sonner";
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";
import {
  getRealtimeVoice,
  type CharacterName,
} from "../lib/voice/voiceMapping";
import { apiRequest } from "../lib/apiRequest";

export const Chat = () => {
  const {
    selectedPoliteness,
    selectedLevel,
    checkGrammarMode,
    chatId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setChatId, // Used by ModeSelectScreen
    chatMode,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setChatMode, // Used by ModeSelectScreen
    setUsername,
    setSubscriptionPlan,
    setSummary,
    summary,
    summaryFetchLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSummaryFetchLoading, // Used by StopWatch
    selectedCharacter,
    selectedTime,
    selectedTheme,
    customTheme,
    chatEnded,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setChatEnded, // Used by StopWatch
  } = useSpeech();

  const [chatInfo, setChatInfo] = useState<
    { audioUrl: string; english: string }[]
  >([]);
  const [overlayOpened, setOverlayOpened] = useState<boolean>(false);
  const [summaryOpened, setSummaryOpened] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [hiraganaReadingList, setHiraganaReadingList] = useState<string[]>([]);
  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [paymentOverlay, setPaymentOverlay] = useState(false);

  // Footer State
  const [textOpen, setTextOpen] = useState(true);
  const [textInputMode, setTextInputMode] = useState(true);
  const [hiraganaReading, setHiraganaReading] = useState(true);

  const handleSendMessage = useCallback((text: string) => {
    // Optimistically add user message
    setHistory((prev) => [...prev, { role: "user", content: text }]);
    // TODO: Send to Realtime API if supported or Backend
    console.log("Sending text message:", text);
    // Ideally we would trigger the agent response here
  }, []);

  const sessionRef = useRef<RealtimeSession | null>(null);
  const agentRef = useRef<RealtimeAgent | null>(null);
  const currentAssistantTextRef = useRef<string>("");
  const currentAssistantMessageIdRef = useRef<string | null>(null);
  const currentUserTextRef = useRef<string>("");
  const currentUserMessageIdRef = useRef<string | null>(null);

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch trial data");
      }
      return response.json();
    },
    retry: false,
  });

  const { setCreditsRemaining } = useSpeech();

  // Debug: Log history changes to verify state updates
  useEffect(() => {
    console.log("📝 History state updated:", {
      length: history.length,
      messages: history,
    });
  }, [history]);

  useEffect(() => {
    if (!data) return;
    if (data?.trialStatus === "ended") {
      setPaymentOverlay(true);
    }
    if (
      data.user.subscriptionPlan === "pro" &&
      data.user.subscriptionStatus !== "active"
    ) {
      setPaymentOverlay(true);
    }
    setUsername(data?.user.username);
    setSubscriptionPlan(data?.user.subscriptionPlan);
    setCreditsRemaining(data?.user.creditsRemaining || 0);
  }, [data, setCreditsRemaining, setUsername, setSubscriptionPlan]);

  // Initialize Realtime session when chatMode is true and chatId exists
  useEffect(() => {
    if (!chatMode || !chatId || chatEnded) return;

    let mounted = true;

    const initializeSession = async () => {
      try {
        // Get client token from server
        const tokenResponse = await fetch("/api/realtime/token", {
          method: "POST",
          credentials: "include",
        });

        if (!tokenResponse.ok) {
          throw new Error("Failed to get client token");
        }

        const { clientToken, model } = await tokenResponse.json();

        if (!mounted) return;

        const theme = customTheme || selectedTheme || "";
        const formality =
          selectedPoliteness === "casual"
            ? "話し方はカジュアルで、です・ます調は使わない。"
            : "話し方は丁寧で、です・ます調を使う。";

        const fixGrammar = checkGrammarMode
          ? "- あなたは学習者の発話に文法の誤りがあれば、友達のように自然に訂正して正しい文を提示してください。訂正後も会話は自然に続けてください。"
          : "";

        // Create agent with Japanese conversation instructions
        const agent = new RealtimeAgent({
          name: selectedCharacter || "Sakura",
          instructions: `あなたは日本語会話の練習相手です。あなたの名前は${
            selectedCharacter || "Sakura"
          }です。
- 学習者の日本語レベル: ${selectedLevel || "N3"}
- テーマ: ${theme}
- 丁寧さ: ${selectedPoliteness || "polite"}
- 返答は短めで1〜2文で自然に。
- 会話が続くようにオープンエンドの質問を入れる。
- これまでの会話の文脈を踏まえて回答する。
- 自分の名前は${
            selectedCharacter || "Sakura"
          }であることを覚えておいてください。会話の中で名前自然に教えてあげてください。
- ${formality}
${fixGrammar}`,
        } as any);

        agentRef.current = agent;

        // Create session
        const session = new RealtimeSession(agent);

        // Set up event listeners BEFORE connection
        // This ensures listeners are ready when events start firing
        setupEventListeners(session);

        // Get Realtime voice for character
        const realtimeVoice = getRealtimeVoice(
          (selectedCharacter || "Sakura") as CharacterName,
        );

        // Connect session with WebRTC for natural voice conversation
        await session.connect({
          apiKey: clientToken,
          model: model || "gpt-4o-realtime-preview-2024-12-17",
          voice: realtimeVoice, // Set character voice
          voiceActivityDetection: {
            threshold: 0.5,
            prePauseDurationMs: 500,
            postPauseDurationMs: 500,
          },
          turnDetection: {
            type: "server_vad",
          },
        } as any);

        if (!mounted) {
          (session as any).close?.();
          return;
        }

        sessionRef.current = session;
        setIsConnected(true);
        console.log("Realtime session connected successfully");
        console.log("Session object:", session);
        console.log("Session methods:", Object.keys(session as any));

        console.log("Event listeners set up");
        console.log("Current history state:", history);

        // Try to manually trigger a test event to see if listeners work
        setTimeout(() => {
          console.log(
            "Testing if session is still connected:",
            sessionRef.current,
          );
          console.log("Testing if agent is still available:", agentRef.current);
        }, 2000);

        // The AI should automatically start speaking with VAD
        // If it doesn't, the user speaking will trigger the first response
      } catch (error: any) {
        console.error("Failed to initialize session:", error);
        toast.error(error.message || "Failed to connect to Realtime API");
      }
    };

    initializeSession();

    return () => {
      mounted = false;
      if (sessionRef.current) {
        (sessionRef.current as any).close?.();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chatMode,
    chatId,
    selectedCharacter,
    selectedLevel,
    selectedPoliteness,
    selectedTheme,
    customTheme,
    checkGrammarMode,
    chatEnded,
  ]);

  const updateAssistantMessage = useCallback(
    (text: string) => {
      console.log("Updating assistant message:", text);
      if (!currentAssistantMessageIdRef.current) {
        currentAssistantMessageIdRef.current = `assistant-${Date.now()}`;
        const assistantMessage = { role: "assistant", content: text };
        console.log("Adding assistant message to history:", assistantMessage);
        setHistory((prev) => {
          const newHistory = [...prev, assistantMessage];
          console.log("New history after adding:", newHistory);
          return newHistory;
        });
      } else {
        // Find and update the last assistant message (not just the last message)
        setHistory((prev) => {
          // Find the index of the last assistant message
          let lastAssistantIdx = -1;
          for (let i = prev.length - 1; i >= 0; i--) {
            if (prev[i].role === "assistant") {
              lastAssistantIdx = i;
              break;
            }
          }

          if (lastAssistantIdx >= 0) {
            const updated = prev.map((msg, idx) =>
              idx === lastAssistantIdx ? { ...msg, content: text } : msg,
            );
            console.log("Updated history:", updated);
            return updated;
          } else {
            // If no assistant message found, add a new one
            console.log("No assistant message found, adding new one");
            return [...prev, { role: "assistant", content: text }];
          }
        });
      }
    },
    [setHistory],
  );

  const setupEventListeners = useCallback(
    (session: RealtimeSession) => {
      console.log("🔧 Setting up event listeners on session:", session);

      // Try different event listening approaches
      // The Realtime API might use different event names or structure
      const sessionAny = session as any;

      // Debug: Try to log all possible events
      if (sessionAny.on) {
        console.log("✅ Session has .on() method");
      } else if (sessionAny.addEventListener) {
        console.log("✅ Session has .addEventListener() method");
      } else if (sessionAny.emitter) {
        console.log("✅ Session has .emitter property");
      } else {
        console.log("❌ Session event methods:", Object.keys(sessionAny));
        console.log("❌ Full session object:", sessionAny);
      }

      // Try wildcard listener
      if (sessionAny.on) {
        try {
          sessionAny.on("*", (event: any, data: any) => {
            console.log("🔥🔥🔥 Realtime event (wildcard):", event, data);
          });
          console.log("✅ Wildcard listener registered");
        } catch (e) {
          console.log("❌ Wildcard listener failed:", e);
        }
      }

      // Also try listening on the agent if it has events
      if (agentRef.current) {
        const agentAny = agentRef.current as any;
        if (agentAny.on) {
          console.log("✅ Agent has .on() method, trying agent events");
          agentAny.on("*", (event: any, data: any) => {
            console.log("🔥🔥🔥 Agent event (wildcard):", event, data);
          });
        }
      }

      // User started speaking (VAD detected)
      (session as any).on?.(
        "conversation.item.input_audio_transcription.started",
        () => {
          console.log("User started speaking");
          setIsUserSpeaking(true);
          // If AI is speaking, this is an interruption
          if (isAgentSpeaking) {
            setIsAgentSpeaking(false);
          }
        },
      );

      // User audio transcription in progress (streaming)
      (session as any).on?.(
        "conversation.item.input_audio_transcription.delta",
        (event: any) => {
          console.log("User transcription delta:", event);
          const transcript = event.transcript;
          if (transcript) {
            currentUserTextRef.current = transcript;

            // Update or create user message in history
            if (!currentUserMessageIdRef.current) {
              currentUserMessageIdRef.current = `user-${Date.now()}`;
              const userMessage = { role: "user", content: transcript };
              console.log("Adding user message to history:", userMessage);
              setHistory((prev) => [...prev, userMessage]);
            } else {
              setHistory((prev) =>
                prev.map((msg, idx) =>
                  idx === prev.length - 1 && msg.role === "user"
                    ? { ...msg, content: transcript }
                    : msg,
                ),
              );
            }
          }
        },
      );

      // User audio transcription completed - save to DB
      (session as any).on?.(
        "conversation.item.input_audio_transcription.completed",
        async (event: any) => {
          const transcript = event.transcript || currentUserTextRef.current;
          if (transcript && chatId) {
            // Update history
            setHistory((prev) =>
              prev.map((msg, idx) =>
                idx === prev.length - 1 && msg.role === "user"
                  ? { ...msg, content: transcript }
                  : msg,
              ),
            );

            // Save to database
            try {
              await apiRequest("/api/realtime/save-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chatId,
                  sender: "user",
                  message: transcript,
                }),
              });
            } catch (error) {
              console.error("Failed to save user message:", error);
            }

            currentUserMessageIdRef.current = null;
            currentUserTextRef.current = "";
            setHiraganaReadingList((prev) => [...prev, ""]);
            setChatInfo((prev) => [...prev, { audioUrl: "", english: "" }]);
          }
          setIsUserSpeaking(false);
        },
      );

      // Assistant response text/transcript streaming
      (session as any).on?.("response.text.delta", (event: any) => {
        console.log("Assistant text delta:", event);
        const text = event.text;
        if (text) {
          currentAssistantTextRef.current = text;
          updateAssistantMessage(text);
        }
      });

      (session as any).on?.("response.audio_transcript.delta", (event: any) => {
        console.log("Assistant audio transcript delta:", event);
        const transcript = event.transcript;
        if (transcript) {
          currentAssistantTextRef.current = transcript;
          updateAssistantMessage(transcript);
        }
      });

      // Also listen for response.text.done and response.audio_transcript.done
      (session as any).on?.("response.text.done", (event: any) => {
        console.log("Assistant text done:", event);
        const text = event.text || currentAssistantTextRef.current;
        if (text) {
          currentAssistantTextRef.current = text;
          updateAssistantMessage(text);
        }
      });

      (session as any).on?.("response.audio_transcript.done", (event: any) => {
        console.log("Assistant audio transcript done:", event);
        const transcript = event.transcript || currentAssistantTextRef.current;
        if (transcript) {
          currentAssistantTextRef.current = transcript;
          updateAssistantMessage(transcript);
        }
      });

      // Assistant response completed - save to DB
      (session as any).on?.("response.done", async () => {
        const finalText = currentAssistantTextRef.current;
        if (finalText && chatId) {
          updateAssistantMessage(finalText);

          // Generate reading and english translation
          try {
            const readingResponse = await apiRequest(
              "/api/realtime/save-message",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chatId,
                  sender: "assistant",
                  message: finalText,
                  // Reading and english will be generated server-side if not provided
                }),
              },
            );

            // Update chatInfo with reading/english if available
            if (readingResponse.reading || readingResponse.english) {
              setHiraganaReadingList((prev) => [
                ...prev,
                readingResponse.reading || "",
              ]);
              setChatInfo((prev) => [
                ...prev,
                {
                  audioUrl: "",
                  english: readingResponse.english || "",
                },
              ]);
            }
          } catch (error) {
            console.error("Failed to save assistant message:", error);
          }

          currentAssistantMessageIdRef.current = null;
          currentAssistantTextRef.current = "";
        }
        setIsAgentSpeaking(false);
      });

      // Assistant started speaking
      (session as any).on?.("response.audio_transcript.started", () => {
        setIsAgentSpeaking(true);
      });

      (session as any).on?.("response.audio.started", () => {
        setIsAgentSpeaking(true);
      });

      (session as any).on?.("response.audio.done", () => {
        setIsAgentSpeaking(false);
      });

      // Response interrupted
      (session as any).on?.("response.interrupted", () => {
        if (currentAssistantMessageIdRef.current) {
          updateAssistantMessage(
            currentAssistantTextRef.current + " [interrupted]",
          );
          currentAssistantMessageIdRef.current = null;
          currentAssistantTextRef.current = "";
        }
        setIsAgentSpeaking(false);
      });

      // Error handling
      (session as any).on?.("error", (error: any) => {
        console.error("Realtime session error:", error);
        toast.error(error.message || "An error occurred");
      });

      // Connection events
      (session as any).on?.("connection.opened", () => {
        console.log("Realtime connection opened");
      });

      (session as any).on?.("connection.closed", () => {
        console.log("Realtime connection closed");
        setIsConnected(false);
      });
    },
    [
      chatId,
      setHistory,
      setIsAgentSpeaking,
      setIsUserSpeaking,
      setHiraganaReadingList,
      setChatInfo,
      updateAssistantMessage,
      isAgentSpeaking,
    ],
  );

  const handleRefreshPreviousData = () => {
    setChatInfo([]);
    setSummary(null);
    setHistory([]);
    setHiraganaReadingList([]);
  };

  return (
    <div className="relative w-full h-screen flex">
      {/* サイドバー */}
      <Sidebar />
      {chatMode ? (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-green-50 overflow-auto w-full">
          <ModeSelectScreen
            setHistory={setHistory}
            setChatInfo={setChatInfo}
            setHiraganaReadingList={setHiraganaReadingList}
            setPaymentOverlay={setPaymentOverlay}
            needPayment={
              data?.trialStatus === "ended" ||
              (data?.user.subscriptionPlan === "pro" &&
                data?.user.subscriptionStatus !== "active")
            }
            plan={data?.user.subscriptionPlan === "pro" ? "pro" : "trial"}
            handleRefreshPreviousData={handleRefreshPreviousData}
          />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 w-full flex flex-col justify-between">
          <ChatHeader
            title="Chat"
            chatPage={true}
            history={history}
            characterName={selectedCharacter}
          />
          {/* Debug: Show history count and content */}
          {/* {process.env.NODE_ENV === "development" && (
            <div className="absolute top-4 left-4 bg-black/80 text-white text-xs p-3 rounded z-50 max-w-xs">
              <div className="font-bold mb-1">Debug Info:</div>
              <div>History count: {history.length}</div>
              <div>ChatId: {chatId || "none"}</div>
              <div>Connected: {isConnected ? "Yes" : "No"}</div>
              {history.length > 0 && (
                <div className="mt-2 border-t pt-2">
                  <div className="font-bold">
                    Last {Math.min(3, history.length)} messages:
                  </div>
                  {history.slice(-3).map((msg, idx) => (
                    <div key={idx} className="mt-1 text-[10px]">
                      {msg.role}: {msg.content?.substring(0, 40) || "(empty)"}
                      ...
                    </div>
                  ))}
                </div>
              )}
            </div>
          )} */}
          <Messages
            history={history}
            chatInfo={chatInfo}
            chatLoading={false} // Realtime API handles loading internally
            hiraganaReadingList={hiraganaReadingList}
            characterName={selectedCharacter}
          />
          {/* Voice Status Indicator */}
          <ChatFooter
            isConnected={isConnected}
            isUserSpeaking={isUserSpeaking}
            isAgentSpeaking={isAgentSpeaking}
            textOpen={textOpen}
            setTextOpen={setTextOpen}
            textInputMode={textInputMode}
            setTextInputMode={setTextInputMode}
            hiraganaReading={hiraganaReading}
            setHiraganaReading={setHiraganaReading}
            onSendMessage={handleSendMessage}
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
            isPro={data?.user?.subscriptionPlan === "pro"}
            onClose={() => setPaymentOverlay(false)}
          />
        </Overlay>
      )}
    </div>
  );
};

export default Chat;
