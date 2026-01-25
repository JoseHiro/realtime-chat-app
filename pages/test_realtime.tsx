import React, { useState, useRef, useEffect } from "react";
import { Mic } from "lucide-react";
import {
  AssistantMessageBox,
  UserMessageBox,
} from "../component/ui/Chat/Message";
import { toast } from "sonner";
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  reading?: string;
  english?: string;
  isStreaming?: boolean;
};

const TestRealtime = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const sessionRef = useRef<RealtimeSession | null>(null);
  const agentRef = useRef<RealtimeAgent | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAssistantTextRef = useRef<string>("");
  const currentAssistantMessageIdRef = useRef<string | null>(null);
  const currentUserTextRef = useRef<string>("");
  const currentUserMessageIdRef = useRef<string | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Initialize Realtime session
  useEffect(() => {
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

        // Create agent with Japanese conversation instructions
        const agent = new RealtimeAgent({
          name: "Sakura",
          instructions: `あなたは日本語会話の練習相手です。あなたの名前はSakuraです。
- 学習者の日本語レベル: N3
- 丁寧さ: polite
- 返答は短めで1〜2文で自然に。
- 会話が続くようにオープンエンドの質問を入れる。
- これまでの会話の文脈を踏まえて回答する。
- 話し方は丁寧で、です・ます調を使う。`,
        } as any);

        agentRef.current = agent;

        // Create session
        const session = new RealtimeSession(agent);

        // Set up event listeners
        setupEventListeners(session);

        // Connect session with WebRTC (default) for natural voice conversation
        // WebRTC provides automatic VAD, low latency, and interruption support
        await session.connect({
          apiKey: clientToken,
          model: model || "gpt-4o-realtime-preview-2024-12-17",
          // Enable automatic voice activity detection (VAD) for natural conversation
          // This allows users to speak naturally without pressing buttons
          voiceActivityDetection: {
            threshold: 0.5, // Sensitivity (0-1)
            prePauseDurationMs: 500, // How long to wait before considering speech ended
            postPauseDurationMs: 500, // How long silence before ending turn
          },
          // Allow interruptions - user can interrupt AI mid-sentence
          turnDetection: {
            type: "server_vad", // Use server-side VAD for better accuracy
          },
        } as any);

        if (!mounted) {
          (session as any).close?.();
          return;
        }

        sessionRef.current = session;
        setIsConnected(true);
        toast.success("Connected to Realtime API");
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
    // setupEventListeners is stable and uses state setters, safe to ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupEventListeners = (session: RealtimeSession) => {
    // User started speaking (VAD detected)
    (session as any).on?.(
      "conversation.item.input_audio_transcription.started",
      () => {
        setIsUserSpeaking(true);
        setIsListening(true);
        // If AI is speaking, this is an interruption
        if (isAgentSpeaking) {
          // The API will automatically handle the interruption
          setIsAgentSpeaking(false);
        }
      }
    );

    // User audio transcription in progress (streaming)
    (session as any).on?.(
      "conversation.item.input_audio_transcription.delta",
      (event: any) => {
        const transcript = event.transcript;
        if (transcript) {
          currentUserTextRef.current = transcript;

          // Update or create user message
          if (!currentUserMessageIdRef.current) {
            currentUserMessageIdRef.current = `user-${Date.now()}`;
            const userMessage: Message = {
              id: currentUserMessageIdRef.current,
              role: "user",
              content: transcript,
              isStreaming: true,
            };
            setMessages((prev) => [...prev, userMessage]);
          } else {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === currentUserMessageIdRef.current
                  ? { ...msg, content: transcript, isStreaming: true }
                  : msg
              )
            );
          }
        }
      }
    );

    // User audio transcription completed
    (session as any).on?.(
      "conversation.item.input_audio_transcription.completed",
      (event: any) => {
        const transcript = event.transcript || currentUserTextRef.current;
        if (transcript && currentUserMessageIdRef.current) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentUserMessageIdRef.current
                ? { ...msg, content: transcript, isStreaming: false }
                : msg
            )
          );
          currentUserMessageIdRef.current = null;
          currentUserTextRef.current = "";
        }
        setIsUserSpeaking(false);
        setIsListening(false);
      }
    );

    // Assistant response text started (before audio)
    (session as any).on?.("response.text.delta", (event: any) => {
      const text = event.text;
      if (text) {
        currentAssistantTextRef.current = text;

        // Update or create assistant message
        if (!currentAssistantMessageIdRef.current) {
          currentAssistantMessageIdRef.current = `assistant-${Date.now()}`;
          const assistantMessage: Message = {
            id: currentAssistantMessageIdRef.current,
            role: "assistant",
            content: text,
            isStreaming: true,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentAssistantMessageIdRef.current
                ? { ...msg, content: text, isStreaming: true }
                : msg
            )
          );
        }
      }
    });

    // Assistant audio transcript (alternative event)
    (session as any).on?.("response.audio_transcript.delta", (event: any) => {
      const transcript = event.transcript;
      if (transcript) {
        currentAssistantTextRef.current = transcript;

        // Update or create assistant message
        if (!currentAssistantMessageIdRef.current) {
          currentAssistantMessageIdRef.current = `assistant-${Date.now()}`;
          const assistantMessage: Message = {
            id: currentAssistantMessageIdRef.current,
            role: "assistant",
            content: transcript,
            isStreaming: true,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentAssistantMessageIdRef.current
                ? { ...msg, content: transcript, isStreaming: true }
                : msg
            )
          );
        }
      }
    });

    // Assistant response completed
    (session as any).on?.("response.done", () => {
      if (currentAssistantMessageIdRef.current) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === currentAssistantMessageIdRef.current
              ? {
                  ...msg,
                  content: currentAssistantTextRef.current,
                  isStreaming: false,
                }
              : msg
          )
        );
        currentAssistantMessageIdRef.current = null;
        currentAssistantTextRef.current = "";
      }
      setIsAgentSpeaking(false);
      setIsListening(true); // Ready for next user input
    });

    // Response interrupted (user started speaking while AI was speaking)
    (session as any).on?.("response.interrupted", () => {
      if (currentAssistantMessageIdRef.current) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === currentAssistantMessageIdRef.current
              ? {
                  ...msg,
                  content: currentAssistantTextRef.current + " [interrupted]",
                  isStreaming: false,
                }
              : msg
          )
        );
        currentAssistantMessageIdRef.current = null;
        currentAssistantTextRef.current = "";
      }
      setIsAgentSpeaking(false);
    });

    // Assistant started speaking
    (session as any).on?.("response.audio_transcript.started", () => {
      setIsAgentSpeaking(true);
    });

    // Assistant audio started
    (session as any).on?.("response.audio.started", () => {
      setIsAgentSpeaking(true);
    });

    // Assistant audio stopped
    (session as any).on?.("response.audio.done", () => {
      setIsAgentSpeaking(false);
    });

    // Error handling
    (session as any).on?.("error", (error: any) => {
      console.error("Realtime session error:", error);
      toast.error(error.message || "An error occurred");
    });

    // Connection events
    (session as any).on?.("connection.opened", () => {
      console.log("Connection opened");
    });

    (session as any).on?.("connection.closed", () => {
      console.log("Connection closed");
      setIsConnected(false);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Realtime Voice Chat (OpenAI Realtime API)
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <p className="text-sm text-gray-500">
            {isConnected ? "Connected" : "Connecting..."}
          </p>
          {isAgentSpeaking && (
            <span className="text-sm text-blue-500 ml-2">
              AI is speaking...
            </span>
          )}
          {isUserSpeaking && (
            <span className="text-sm text-green-500 ml-2">
              You are speaking...
            </span>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 text-lg">
                {isConnected
                  ? "Click the microphone button to start speaking"
                  : "Connecting to Realtime API..."}
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 transition-all duration-300 ease-out ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-md lg:max-w-2xl transform transition-all duration-300 ${
                message.role === "user" ? "order-1" : ""
              }`}
            >
              {message.role === "assistant" && (
                <AssistantMessageBox
                  text={message.content}
                  reading={message.reading || ""}
                  english={message.english}
                  id={messages.indexOf(message)}
                />
              )}
              {message.role === "user" && (
                <UserMessageBox
                  id={messages.indexOf(message)}
                  text={message.content}
                />
              )}
              {message.isStreaming && (
                <div className="mt-2 text-xs text-gray-400">
                  <span className="animate-pulse">AI is typing...</span>
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Status Area - Natural Conversation Mode */}
      <div className="p-4 lg:p-6 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-center flex-col space-y-4">
          {/* Visual indicator for conversation state */}
          <div className="flex items-center gap-4">
            {/* Listening indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  !isConnected
                    ? "bg-gray-300"
                    : isListening && !isUserSpeaking && !isAgentSpeaking
                    ? "bg-green-100 border-4 border-green-500 animate-pulse"
                    : isUserSpeaking
                    ? "bg-blue-500 scale-110"
                    : isAgentSpeaking
                    ? "bg-purple-500"
                    : "bg-gray-200"
                }`}
              >
                <Mic
                  className={`w-8 h-8 ${
                    isUserSpeaking || (isListening && !isAgentSpeaking)
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {!isConnected
                  ? "Connecting..."
                  : isUserSpeaking
                  ? "You're speaking"
                  : isAgentSpeaking
                  ? "AI is speaking"
                  : "Listening..."}
              </p>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {!isConnected
                ? "Connecting to Realtime API..."
                : isUserSpeaking
                ? "🎤 You're speaking..."
                : isAgentSpeaking
                ? "🤖 AI is responding..."
                : "👂 Listening - speak naturally"}
            </p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {isConnected &&
                "Voice Activity Detection (VAD) is active. Speak naturally - you can even interrupt the AI mid-sentence!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRealtime;
