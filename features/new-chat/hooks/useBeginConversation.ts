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
import { getRealtimeVoice } from "../../../lib/voice/voiceMapping";
import type { CharacterName } from "../../../lib/voice/voiceMapping";

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
const MAX_RECONNECT = 3;

let realtimeTotalCost = 0;
export const getRealtimeTotalCost = () => realtimeTotalCost;

function buildSystemInstructions(
  params: {
    selectedCharacter: string;
    selectedLevel: string;
    selectedPoliteness: string;
    selectedTheme: string;
  },
  history?: { role: string; content: string }[],
): string {
  const { selectedCharacter, selectedLevel, selectedPoliteness, selectedTheme } = params;
  const formality =
    selectedPoliteness === "casual"
      ? "話し方はカジュアルで、です・ます調は使わない。"
      : "話し方は丁寧で、です・ます調を使う。";

  let instructions = `あなたは日本語学習者のアシスタントで、あなたの名前は${selectedCharacter}です。
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

  if (history && history.length > 0) {
    instructions += `\n\n【接続が一時的に切れたため再接続しました。これまでの会話の続きです】\n`;
    history.slice(-8).forEach((msg) => {
      instructions += `${msg.role === "user" ? "ユーザー" : "あなた"}: ${msg.content}\n`;
    });
    instructions += `\n上記の続きから自然に会話を再開してください。`;
  }

  return instructions;
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

function float32ToWav(samples: Float32Array, sampleRate: number): Blob {
  const dataSize = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
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
  const [micLevel, setMicLevel] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const sessionRef = useRef<any | null>(null);
  const chatIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextAudioTimeRef = useRef(0);
  const assistantTranscriptRef = useRef("");
  const pcmChunksRef = useRef<Float32Array[]>([]);
  const blobUrlsRef = useRef<string[]>([]);
  const historyRef = useRef<{ role: string; content: string }[]>([]);
  const reconnectAttemptsRef = useRef(0);
  const userClosedRef = useRef(false);

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
    reconnectAttemptsRef.current = 0;
    userClosedRef.current = false;
    handleRefreshPreviousData();

    // ── Handlers shared between initial connect and reconnect ──────────────

    function buildMessage(msg: any) {
      const audioCtx = audioContextRef.current;
      if (!audioCtx) return;

      // Model audio parts → play + accumulate for replay
      const parts = msg.serverContent?.modelTurn?.parts ?? [];
      for (const part of parts) {
        if (part.inlineData?.mimeType?.includes("audio/pcm") && part.inlineData?.data) {
          const float32 = base64ToFloat32(part.inlineData.data);
          pcmChunksRef.current.push(float32);
          const buffer = audioCtx.createBuffer(1, float32.length, OUTPUT_SAMPLE_RATE);
          buffer.copyToChannel(new Float32Array(float32), 0);
          const bufSource = audioCtx.createBufferSource();
          bufSource.buffer = buffer;
          bufSource.connect(audioCtx.destination);
          const startTime = Math.max(audioCtx.currentTime, nextAudioTimeRef.current);
          bufSource.start(startTime);
          nextAudioTimeRef.current = startTime + buffer.duration;
        }
      }

      // Streaming transcript
      if (msg.serverContent?.outputTranscription?.text) {
        assistantTranscriptRef.current += msg.serverContent.outputTranscription.text;
        setStreamingMessage(assistantTranscriptRef.current);
      }

      // Interrupted → reset
      if (msg.serverContent?.interrupted) {
        nextAudioTimeRef.current = audioCtx.currentTime;
        assistantTranscriptRef.current = "";
        pcmChunksRef.current = [];
        setStreamingMessage("");
      }

      // Turn complete → save to DB + build blob URL
      if (msg.serverContent?.turnComplete) {
        const text = assistantTranscriptRef.current.trim();
        assistantTranscriptRef.current = "";
        setStreamingMessage("");

        let audioUrl = "";
        if (pcmChunksRef.current.length > 0) {
          const totalLen = pcmChunksRef.current.reduce((s, c) => s + c.length, 0);
          const merged = new Float32Array(totalLen);
          let off = 0;
          for (const chunk of pcmChunksRef.current) { merged.set(chunk, off); off += chunk.length; }
          const wav = float32ToWav(merged, OUTPUT_SAMPLE_RATE);
          audioUrl = URL.createObjectURL(wav);
          blobUrlsRef.current.push(audioUrl);
        }
        pcmChunksRef.current = [];

        if (text) {
          setHistory((prev) => {
            const next = [...prev, { role: "assistant", content: text }];
            historyRef.current = next;
            return next;
          });
          const currentChatId = chatIdRef.current;
          if (currentChatId != null) {
            apiRequest("/api/realtime/save-message", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chatId: currentChatId, sender: "assistant", message: text, reading: "", english: "" }),
            }).then((res: { reading?: string; english?: string }) => {
              if (res?.reading) setHiraganaReadingList((prev) => [...prev, res.reading!]);
              setChatInfo((prev) => [...prev, { audioUrl, english: res?.english ?? "" }]);
            });
          } else {
            setChatInfo((prev) => [...prev, { audioUrl, english: "" }]);
          }
        }
      }

      // Cost tracking
      if (msg.usageMetadata) {
        const inputTokens = msg.usageMetadata.promptTokenCount ?? 0;
        const outputTokens = msg.usageMetadata.candidatesTokenCount ?? 0;
        realtimeTotalCost += (inputTokens / 1_000_000) * 0.1 + (outputTokens / 1_000_000) * 0.4;
      }
    }

    async function doReconnect() {
      if (userClosedRef.current) return;
      if (reconnectAttemptsRef.current >= MAX_RECONNECT) {
        toast.error("接続が切れました。チャットを再起動してください。", { position: "top-center" });
        setIsReconnecting(false);
        return;
      }
      reconnectAttemptsRef.current += 1;
      setIsReconnecting(true);

      // Exponential backoff: 1s, 2s, 3s
      await new Promise((r) => setTimeout(r, 1000 * reconnectAttemptsRef.current));

      try {
        const res = await fetch("/api/chat/start_gemini_chat_session", { method: "POST" });
        if (!res.ok) throw new Error("Failed to get API key");
        const { apiKey } = await res.json();
        await connectGeminiSession(apiKey, true);
      } catch {
        setIsReconnecting(false);
        toast.error("再接続に失敗しました。", { position: "top-center" });
      }
    }

    async function connectGeminiSession(apiKey: string, isReconnect = false) {
      const ai = new GoogleGenAI({ apiKey });
      const session = await ai.live.connect({
        model: GEMINI_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: getRealtimeVoice(selectedCharacter as CharacterName) } } },
          systemInstruction: {
            parts: [{
              text: buildSystemInstructions(
                { selectedCharacter, selectedLevel, selectedPoliteness, selectedTheme: selectedTheme || customTheme },
                isReconnect ? historyRef.current : undefined,
              ),
            }],
          },
        },
        callbacks: {
          onopen: () => {
            console.log("[Gemini Live] Session opened", isReconnect ? "(reconnect)" : "");
            if (isReconnect) {
              reconnectAttemptsRef.current = 0;
              setIsReconnecting(false);
              toast.success("再接続しました。", { position: "top-center" });
              session.sendClientContent({
                turns: [{ role: "user", parts: [{ text: "接続が回復しました。続けましょう。" }] }],
                turnComplete: true,
              });
            }
          },
          onmessage: buildMessage,
          onerror: (e: any) => {
            console.error("[Gemini Live] Error", e);
            doReconnect();
          },
          onclose: (e: any) => {
            console.log("[Gemini Live] Closed — code:", e?.code, "wasClean:", e?.wasClean);
            processorRef.current?.disconnect();
            if (!e?.wasClean) doReconnect();
          },
        },
      });

      sessionRef.current = session;

      // Wire (or rewire) processor → new session
      if (processorRef.current) {
        processorRef.current.onaudioprocess = (e) => {
          const float32 = e.inputBuffer.getChannelData(0);
          // Mic level (RMS)
          let sum = 0;
          for (let i = 0; i < float32.length; i++) sum += float32[i] * float32[i];
          setMicLevel(Math.min(1, Math.sqrt(sum / float32.length) * 10));
          // Send to Gemini
          const pcm16 = floatTo16BitPCM(float32);
          session.sendRealtimeInput({ audio: { data: arrayBufferToBase64(pcm16), mimeType: "audio/pcm;rate=16000" } });
        };
      }
    }

    // ── Initial setup ──────────────────────────────────────────────────────

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

      const chatId = startNewChat?.id ?? null;
      if (chatId == null) console.warn("[start-chat] No chatId returned");
      chatIdRef.current = chatId;
      setChatId(chatId);
      setChatMode(true);

      // 2. Get Gemini API key
      const sessionRes = await fetch("/api/chat/start_gemini_chat_session", { method: "POST" });
      if (!sessionRes.ok) throw new Error("Failed to get Gemini session");
      const { apiKey } = await sessionRes.json();

      // 3. Setup microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });

      const audioContext = new AudioContext({ sampleRate: INPUT_SAMPLE_RATE });
      audioContextRef.current = audioContext;
      nextAudioTimeRef.current = 0;

      const source = audioContext.createMediaStreamSource(stream);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const processor = audioContext.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      // 4. Connect Gemini
      await connectGeminiSession(apiKey, false);
      source.connect(processor);
      processor.connect(audioContext.destination);

      // 5. Trigger AI to speak first
      sessionRef.current?.sendClientContent({
        turns: [{ role: "user", parts: [{ text: "会話を始めてください。まず挨拶してください。" }] }],
        turnComplete: true,
      });
    } catch (error) {
      console.error("[useBeginConversation]", error);
      toast.error("Failed to start conversation. Please try again.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }, [
    needPayment, plan, selectedLevel, selectedTheme, customTheme,
    selectedPoliteness, selectedTime, selectedCharacter, loading,
    handleRefreshPreviousData, setChatId, setChatMode, setPaymentOverlay,
    setHistory, setHiraganaReadingList, setChatInfo,
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
      setHistory((prev) => {
        const next = [...prev, { role: "user", content: text }];
        historyRef.current = next;
        return next;
      });
      const currentChatId = chatIdRef.current;
      if (currentChatId != null) {
        apiRequest("/api/realtime/save-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId: currentChatId, sender: "user", message: text, reading: "", english: "" }),
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
  }, [selectedLevel, selectedTheme, customTheme, selectedPoliteness, selectedCharacter, selectedTime]);

  const stopConversation = useCallback(() => {
    userClosedRef.current = true;
    sessionRef.current?.close();
    sessionRef.current = null;
    processorRef.current?.disconnect();
    processorRef.current = null;
    if (audioContextRef.current?.state !== "closed") audioContextRef.current?.close();
    audioContextRef.current = null;
    for (const url of blobUrlsRef.current) URL.revokeObjectURL(url);
    blobUrlsRef.current = [];
    pcmChunksRef.current = [];
    historyRef.current = [];
    reconnectAttemptsRef.current = 0;
    setMicLevel(0);
    setIsReconnecting(false);
  }, []);

  return {
    handleBeginConversation,
    sendTextMessage,
    handleStartChat,
    stopConversation,
    sessionRef,
    loading,
    streamingMessage,
    micLevel,
    isReconnecting,
  };
};
