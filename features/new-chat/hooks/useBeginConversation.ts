/**
 * Realtime "begin conversation" flow for the new-chat page.
 * Used by: pages/new_chat.tsx
 */

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "../../../lib/apiRequest";

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

const REALTIME_MODEL = "gpt-4o-realtime-preview";
const REALTIME_API = "https://api.openai.com/v1/realtime";

function buildSessionInstructions(params: {
  selectedCharacter: string;
  selectedLevel: string;
  selectedPoliteness: string;
  selectedTheme: string;
}): string {
  const {
    selectedCharacter,
    selectedLevel,
    selectedPoliteness,
    selectedTheme,
  } = params;
  return `あなたは日本語学習者のアシスタントで、あなたの名前は${selectedCharacter}です。
- 学習者のレベルは${selectedLevel}です。
- 丁寧さ: ${selectedPoliteness || "polite"}
- テーマ: ${selectedTheme}
- 返答は短めで1〜2文で自然に。
- 会話が続くようにオープンエンドの質問を入れる。
- これまでの会話の文脈を踏まえて回答する。
- 学習者のレベルに合わせて難易度を調整してください。
- 文法を正しくしてください。
- 会話を自然に続けてください。
- 学習者が話している間は、最後までじっくり聞いてください。
- 学習者が言葉に詰まっても、助け舟を出す前に少し待ってください。
- 相手が確実にはっきり話し終えたと判断した時だけ、返答してください。
- 相手がはっきり話しかけてきたときだけ返答してください。雑音や短い音には反応しないでください。`;
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
  const dcRef = useRef<RTCDataChannel | null>(null);
  const chatIdRef = useRef<number | null>(null);

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
    handleRefreshPreviousData();

    try {
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

      const chatId = startNewChat?.id;
      if (chatId == null) {
        throw new Error("Failed to create chat - no chatId returned");
      }
      chatIdRef.current = chatId;
      setChatId(chatId);
      setChatMode(true);

      const pc = new RTCPeerConnection();
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        // After the user has spoken (voice) or sent a message (text), trigger the next AI response.
        // This enforces turn-taking: AI only responds after the user has taken a turn.

        // 1. Only trigger a manual response for TEXT messages.
        // If it's VOICE, server_vad handles the response automatically.
        if (
          msg.type === "conversation.item.created" &&
          msg.item?.role === "user"
        ) {
          const isText = msg.item.content?.[0]?.type === "input_text";

          if (isText) {
            dc.send(
              JSON.stringify({
                type: "response.create",
                response: { modalities: ["audio", "text"] },
              }),
            );
          }
          return;
        }

        // 2. Handle the AI's response transcript
        if (msg.type === "response.audio_transcript.done") {
          const fullText = msg.transcript ?? "";
          if (!fullText) return;

          // Update History
          setHistory((prev) => [
            ...prev,
            { role: "assistant", content: fullText },
          ]);

          // Save to Database
          const currentChatId = chatIdRef.current;
          if (currentChatId != null) {
            apiRequest("/api/realtime/save-message", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chatId: currentChatId,
                sender: "assistant",
                message: fullText,
                reading: "",
                english: "",
              }),
            }).then((res: { reading?: string; english?: string }) => {
              if (res?.reading) {
                setHiraganaReadingList((prev) => [...prev, res.reading!]);
              }
              if (res?.english != null) {
                setChatInfo((prev) => [
                  ...prev,
                  { audioUrl: "", english: res.english ?? "" },
                ]);
              }
            });
          }
        }
      };

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const tokenRes = await fetch("/api/chat/start_realtime_chat_session", {
        method: "POST",
      });
      if (!tokenRes.ok) {
        throw new Error(`Realtime session failed: ${tokenRes.status}`);
      }
      const session = await tokenRes.json();
      const ephemeralKey = session.client_secret.value;

      const sdpRes = await fetch(`${REALTIME_API}?model=${REALTIME_MODEL}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
      });
      const answerSDP = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSDP });

      await new Promise<void>((resolve) => {
        dc.onopen = () => {
          console.log("接続成功");
          dc.send(
            JSON.stringify({
              type: "session.update",
              session: {

                instructions: buildSessionInstructions({
                  selectedCharacter,
                  selectedLevel,
                  selectedPoliteness,
                  selectedTheme,
                }),
                turn_detection: null,
                // turn_detection: {
                //   type: "server_vad",
                //   threshold: 0.5,
                //   prefix_padding_ms: 300,
                //   silence_duration_ms: 2000,
                // },
              },
            }),
          );
          dc.send(
            JSON.stringify({
              type: "response.create",
              response: {
                modalities: ["audio", "text"],
              },
            }),
          );
          resolve();
        };
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
      if (!dcRef.current || dcRef.current.readyState !== "open") {
        toast.error("まだ接続されていません");
        return;
      }

      dcRef.current.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [{ type: "input_text", text }],
          },
        }),
      );
      // Do not send response.create here; it is sent in dc.onmessage when we
      // receive conversation.item.added (user), so the next response is only
      // triggered after the user turn is committed (same path for text and voice).
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

  return {
    handleBeginConversation,
    sendTextMessage,
    handleStartChat,
    dcRef,
    loading,
  };
};
