/**
 * Gemini Live "begin conversation" flow for the new-chat page.
 * Used by: pages/chat.tsx
 *
 * OpenAI Realtime (WebRTC) version is preserved in useBeginConversation.openai.ts
 */

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "../../../lib/apiRequest";
import { GoogleGenAI, Modality } from "@google/genai";

export interface UseBeginConversationParams {
  needPayment: boolean;
  plan: "pro" | "trial";
  setPaymentOverlay: (open: boolean) => void;
  handleRefreshPreviousData: () => void;
  setChatId: (id: number) => void;
  setChatMode: (mode: boolean) => void;
  setHistory: React.Dispatch<
    React.SetStateAction<{ role: string; content: string }[]>
  >;
  setHiraganaReadingList: React.Dispatch<React.SetStateAction<string[]>>;
  setChatInfo: React.Dispatch<
    React.SetStateAction<{ audioUrl: string; english: string }[]>
  >;
  selectedLevel: string;
  selectedTheme: string;
  customTheme: string;
  selectedPoliteness: string;
  selectedTime: number;
  selectedCharacter: string;
}

const GEMINI_MODEL = "gemini-2.5-flash-native-audio-latest";

const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

// Module-level cost accumulator (reset on each new conversation)
let realtimeTotalCost = 0;
export const getRealtimeTotalCost = () => realtimeTotalCost;

function buildSystemInstructions(params: {
  selectedCharacter: string;
  selectedLevel: string;
  selectedPoliteness: string;
  selectedTheme: string;
}): string {
  const { selectedCharacter, selectedLevel, selectedPoliteness, selectedTheme } = params;
  const formality =
    selectedPoliteness === "casual"
      ? "話し方はカジュアルで、です・ます調は使わない。"
      : "話し方は丁寧で、です・ます調を使う。";
  return `あなたは日本語学習者のアシスタントで、あなたの名前は${selectedCharacter}です。
- 学習者のレベルは${selectedLevel}です。
- 丁寧さ: ${selectedPoliteness || "polite"}
- テーマ: ${selectedTheme}
- 返答は短めで1〜2文で自然に。
- 会話が続くようにオープンエンドの質問を入れる。
- これまでの会話の文脈を踏まえて回答する。
- 学習者のレベルに合わせて難易度を調整してください。
- ${formality}
- 学習者が話している間は、最後までじっくり聞いてください。
- 相手がはっきり話しかけてきたときだけ返答してください。雑音や短い音には反応しないでください。`;
}

function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

export const useBeginConversation = (params: UseBeginConversationParams) => {
  const {
    needPayment,
    plan,
    setPaymentOverlay,
    handleRefreshPreviousData,
    setChatId,
    setChatMode,
    setHistory,
    setHiraganaReadingList,
    setChatInfo,
    selectedLevel,
    selectedTheme,
    customTheme,
    selectedPoliteness,
    selectedTime,
    selectedCharacter,
  } = params;

  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const sessionRef = useRef<any | null>(null);
  const chatIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextAudioTimeRef = useRef(0);
  const assistantTranscriptRef = useRef("");

  const handleBeginConversation = useCallback(async () => {
    if (needPayment) {
      setPaymentOverlay(true);
      toast.error(
        plan !== "pro"
          ? "Your trial has ended. Please select a plan to continue."
          : "Your pro subscription is not active. Please subscribe to continue.",
        { position: "top-center" },
      );
      return;
    }

    if (loading) return;
    setLoading(true);
    realtimeTotalCost = 0;
    handleRefreshPreviousData();

    try {
      // 1. Create chat in DB
      const startNewChat = await apiRequest("/api/chat/start-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: selectedLevel,
          theme: selectedTheme || customTheme.trim(),
          politeness: selectedPoliteness || "polite",
          characterName: selectedCharacter,
          time: selectedTime,
        }),
      });

      console.log("[start-chat] response:", startNewChat);
      const chatId = startNewChat?.id ?? null;
      if (chatId == null) {
        console.warn("[start-chat] No chatId returned — conversation will not be persisted");
      }
      chatIdRef.current = chatId;
      setChatId(chatId);
      setChatMode(true);

      // 2. Get Gemini API key from server (authenticated users only)
      const sessionRes = await fetch("/api/chat/start_gemini_chat_session", {
        method: "POST",
      });
      if (!sessionRes.ok) throw new Error("Failed to get Gemini session");
      const { apiKey } = await sessionRes.json();

      // 3. Setup microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const audioContext = new AudioContext({ sampleRate: INPUT_SAMPLE_RATE });
      audioContextRef.current = audioContext;
      nextAudioTimeRef.current = 0;

      const source = audioContext.createMediaStreamSource(stream);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const processor = audioContext.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      // 4. Connect to Gemini Live via SDK
      console.log("[Gemini Live] Connecting via SDK...");
      const ai = new GoogleGenAI({ apiKey });
      const session = await ai.live.connect({
        model: GEMINI_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Puck" },
            },
          },
          systemInstruction: {
            parts: [
              {
                text: buildSystemInstructions({
                  selectedCharacter,
                  selectedLevel,
                  selectedPoliteness,
                  selectedTheme: selectedTheme || customTheme,
                }),
              },
            ],
          },
        },
        callbacks: {
          onopen: () => {
            console.log("[Gemini Live] Session opened");
          },
          onmessage: (msg: any) => {
            // Model audio parts
            const parts = msg.serverContent?.modelTurn?.parts ?? [];
            for (const part of parts) {
              if (
                part.inlineData?.mimeType?.includes("audio/pcm") &&
                part.inlineData?.data
              ) {
                const float32 = base64ToFloat32(part.inlineData.data);
                const buffer = audioContext.createBuffer(
                  1,
                  float32.length,
                  OUTPUT_SAMPLE_RATE,
                );
                buffer.copyToChannel(new Float32Array(float32), 0);
                const bufSource = audioContext.createBufferSource();
                bufSource.buffer = buffer;
                bufSource.connect(audioContext.destination);
                const startTime = Math.max(
                  audioContext.currentTime,
                  nextAudioTimeRef.current,
                );
                bufSource.start(startTime);
                nextAudioTimeRef.current = startTime + buffer.duration;
              }
            }

            // Output audio transcription (from outputAudioTranscription config)
            if (msg.serverContent?.outputTranscription?.text) {
              assistantTranscriptRef.current +=
                msg.serverContent.outputTranscription.text;
              setStreamingMessage(assistantTranscriptRef.current);
            }

            // User interrupted → clear audio queue and streaming text
            if (msg.serverContent?.interrupted) {
              nextAudioTimeRef.current = audioContext.currentTime;
              assistantTranscriptRef.current = "";
              setStreamingMessage("");
            }

            // Turn complete → save assistant message to DB
            if (msg.serverContent?.turnComplete) {
              const text = assistantTranscriptRef.current.trim();
              assistantTranscriptRef.current = "";
              setStreamingMessage("");
              if (text) {
                setHistory((prev) => [
                  ...prev,
                  { role: "assistant", content: text },
                ]);
                const currentChatId = chatIdRef.current;
                if (currentChatId != null) {
                  apiRequest("/api/realtime/save-message", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      chatId: currentChatId,
                      sender: "assistant",
                      message: text,
                      reading: "",
                      english: "",
                    }),
                  }).then((res: { reading?: string; english?: string }) => {
                    if (res?.reading)
                      setHiraganaReadingList((prev) => [
                        ...prev,
                        res.reading!,
                      ]);
                    if (res?.english != null)
                      setChatInfo((prev) => [
                        ...prev,
                        { audioUrl: "", english: res.english ?? "" },
                      ]);
                  });
                }
              }
            }

            // Cost tracking
            if (msg.usageMetadata) {
              const inputTokens = msg.usageMetadata.promptTokenCount ?? 0;
              const outputTokens = msg.usageMetadata.candidatesTokenCount ?? 0;
              realtimeTotalCost +=
                (inputTokens / 1_000_000) * 0.1 +
                (outputTokens / 1_000_000) * 0.4;
            }
          },
          onerror: (e: any) => {
            console.error("[Gemini Live] Error — message:", e?.message, "type:", e?.type, e);
            toast.error("Connection error. Please try again.", {
              position: "top-center",
            });
          },
          onclose: (e: any) => {
            console.log("[Gemini Live] Session closed — code:", e?.code, "reason:", e?.reason, "wasClean:", e?.wasClean);
            processorRef.current?.disconnect();
          },
        },
      });
      sessionRef.current = session;
      console.log("[Gemini Live] Session ready, starting audio stream");

      // Start microphone audio streaming (session is now assigned)
      processor.onaudioprocess = (e) => {
        const float32 = e.inputBuffer.getChannelData(0);
        const pcm16 = floatTo16BitPCM(float32);
        const base64 = arrayBufferToBase64(pcm16);
        session.sendRealtimeInput({
          audio: { data: base64, mimeType: "audio/pcm;rate=16000" },
        });
      };
      source.connect(processor);
      processor.connect(audioContext.destination);

      // Trigger AI to speak first
      session.sendClientContent({
        turns: [{ role: "user", parts: [{ text: "会話を始めてください。まず挨拶してください。" }] }],
        turnComplete: true,
      });
    } catch (error) {
      console.error("[useBeginConversation]", error);
      toast.error("Failed to start conversation. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  }, [
    needPayment,
    plan,
    selectedLevel,
    selectedTheme,
    customTheme,
    selectedPoliteness,
    selectedTime,
    selectedCharacter,
    loading,
    handleRefreshPreviousData,
    setChatId,
    setChatMode,
    setPaymentOverlay,
    setHistory,
    setHiraganaReadingList,
    setChatInfo,
  ]);

  const sendTextMessage = useCallback(
    (text: string) => {
      if (!sessionRef.current) {
        toast.error("まだ接続されていません");
        return;
      }

      sessionRef.current.sendClientContent({
        turns: [{ role: "user", parts: [{ text }] }],
        turnComplete: true,
      });

      setHistory((prev) => [...prev, { role: "user", content: text }]);

      const currentChatId = chatIdRef.current;
      if (currentChatId != null) {
        apiRequest("/api/realtime/save-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId: currentChatId,
            sender: "user",
            message: text,
            reading: "",
            english: "",
          }),
        });
      }
    },
    [setHistory],
  );

  const handleStartChat = useCallback(async () => {
    const response = await apiRequest("/api/chat/start-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level: selectedLevel,
        theme: selectedTheme || customTheme.trim(),
        politeness: selectedPoliteness || "polite",
        characterName: selectedCharacter,
        time: selectedTime,
      }),
    });
    return response?.id ?? response?.chatId;
  }, [
    selectedLevel,
    selectedTheme,
    customTheme,
    selectedPoliteness,
    selectedCharacter,
    selectedTime,
  ]);

  const stopConversation = useCallback(() => {
    sessionRef.current?.close();
    sessionRef.current = null;
    processorRef.current?.disconnect();
    processorRef.current = null;
    if (audioContextRef.current?.state !== "closed") {
      audioContextRef.current?.close();
    }
    audioContextRef.current = null;
  }, []);

  return {
    handleBeginConversation,
    sendTextMessage,
    handleStartChat,
    stopConversation,
    sessionRef,
    loading,
    streamingMessage,
  };
};
